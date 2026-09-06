#!/usr/bin/env python3
"""Repository-level quality checks for the DME static site."""

from __future__ import annotations

import json
import os
import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
MAX_BANNER_BYTES = 15 * 1024 * 1024
MAX_SERVICE_IMAGE_BYTES = 450 * 1024
EXPECTED_MEDIA = {
    "assets/images/services/service-fliser-klinker.webp",
    "assets/images/services/service-badevaerelser.webp",
    "assets/images/services/service-facader-fuger.webp",
    "assets/images/services/service-tilbygning.webp",
    "assets/images/services/service-reparationer.webp",
    "assets/video/banner-dme.webm",
    "assets/images/banner-dme-poster.webp",
}
IGNORE_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.refs: list[tuple[str, str]] = []
        self.ids: list[str] = []
        self.lang: str | None = None
        self.title_parts: list[str] = []
        self.in_title = False
        self.meta_description = False
        self.meta_robots = ""
        self.canonical = False
        self.json_ld: list[str] = []
        self._json_depth = 0
        self._json_buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "html":
            self.lang = data.get("lang")
        if "id" in data and data["id"]:
            self.ids.append(data["id"] or "")
        for attr in ("href", "src", "data-src"):
            value = data.get(attr)
            if value:
                self.refs.append((attr, value))
        if tag == "meta":
            name = (data.get("name") or "").lower()
            if name == "description" and (data.get("content") or "").strip():
                self.meta_description = True
            if name == "robots":
                self.meta_robots = (data.get("content") or "").lower()
        if tag == "link" and (data.get("rel") or "").lower() == "canonical" and data.get("href"):
            self.canonical = True
        if tag == "title":
            self.in_title = True
        if tag == "script" and (data.get("type") or "").lower() == "application/ld+json":
            self._json_depth = 1
            self._json_buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self.in_title = False
        if tag == "script" and self._json_depth:
            self.json_ld.append("".join(self._json_buffer).strip())
            self._json_depth = 0
            self._json_buffer = []

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self._json_depth:
            self._json_buffer.append(data)


def html_files() -> list[Path]:
    return sorted(path for path in ROOT.rglob("*.html") if ".git" not in path.parts)


def resolve_local(page: Path, raw: str) -> Path | None:
    value = raw.strip()
    if not value or value.startswith("#"):
        return None
    parsed = urlsplit(value)
    if parsed.scheme.lower() in IGNORE_SCHEMES or parsed.netloc:
        return None
    path = unquote(parsed.path)
    if not path:
        return None
    if path.startswith("/"):
        target = ROOT / path.lstrip("/")
    else:
        target = page.parent / path
    if path.endswith("/"):
        target = target / "index.html"
    elif not target.suffix and target.is_dir():
        target = target / "index.html"
    return target.resolve()


def rel(path: Path) -> str:
    try:
        return path.relative_to(ROOT).as_posix()
    except ValueError:
        return str(path)


def audit_html(errors: list[str], warnings: list[str]) -> None:
    for page in html_files():
        parser = PageParser()
        text = page.read_text(encoding="utf-8")
        parser.feed(text)
        page_name = rel(page)

        if parser.lang != "da-DK":
            errors.append(f"{page_name}: html lang skal være da-DK")
        if not "".join(parser.title_parts).strip():
            errors.append(f"{page_name}: mangler <title>")
        if not parser.meta_description:
            errors.append(f"{page_name}: mangler meta description")
        if "noindex" not in parser.meta_robots and not parser.canonical:
            errors.append(f"{page_name}: indekserbar side mangler canonical")

        duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicates:
            errors.append(f"{page_name}: dublerede id'er: {', '.join(duplicates)}")

        for payload in parser.json_ld:
            if not payload:
                errors.append(f"{page_name}: tom JSON-LD blok")
                continue
            try:
                json.loads(payload)
            except json.JSONDecodeError as exc:
                errors.append(f"{page_name}: ugyldig JSON-LD ({exc})")

        for attr, raw in parser.refs:
            target = resolve_local(page, raw)
            if target is None:
                continue
            try:
                target.relative_to(ROOT)
            except ValueError:
                errors.append(f"{page_name}: {attr} peger uden for projektet: {raw}")
                continue
            if target.exists():
                continue
            expected = rel(target)
            if expected in EXPECTED_MEDIA:
                warnings.append(f"{page_name}: afventer medie: {expected}")
            else:
                errors.append(f"{page_name}: manglende lokal reference: {raw} -> {expected}")

        forbidden = {
            "Plads til bannerfilm": "udvikler-placeholder findes stadig i bruger-HTML",
            "Opret e-mail med forespørgsel": "forældet knaptekst findes stadig",
        }
        for needle, message in forbidden.items():
            if needle in text:
                errors.append(f"{page_name}: {message}")


def audit_media(errors: list[str], warnings: list[str]) -> None:
    banner = ROOT / "assets/video/banner-dme.mp4"
    if banner.exists() and banner.stat().st_size > MAX_BANNER_BYTES:
        errors.append(
            f"assets/video/banner-dme.mp4 er {banner.stat().st_size / 1024 / 1024:.1f} MiB; grænse er 15 MiB"
        )

    services = ROOT / "assets/images/services"
    if services.exists():
        for image in sorted(services.glob("service-*.webp")):
            if image.stat().st_size > MAX_SERVICE_IMAGE_BYTES:
                errors.append(
                    f"{rel(image)} er {image.stat().st_size / 1024:.0f} KiB; grænse er 450 KiB"
                )

    for expected in sorted(EXPECTED_MEDIA):
        if not (ROOT / expected).exists():
            warnings.append(f"Afventer brugerens medie: {expected}")


def audit_repo(errors: list[str], warnings: list[str]) -> None:
    if (ROOT / ".idea").exists():
        errors.append(".idea/ må ikke være committed")
    for required in ("_headers", "_redirects", "robots.txt", "sitemap.xml", "404.html", ".gitignore"):
        if not (ROOT / required).exists():
            errors.append(f"Mangler nødvendig fil: {required}")

    headers = (ROOT / "_headers").read_text(encoding="utf-8") if (ROOT / "_headers").exists() else ""
    for header in (
        "Content-Security-Policy:",
        "Strict-Transport-Security:",
        "X-Content-Type-Options:",
        "Referrer-Policy:",
        "Permissions-Policy:",
    ):
        if header not in headers:
            errors.append(f"_headers mangler {header}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8") if (ROOT / "robots.txt").exists() else ""
    if "https://dmemurer.dk/sitemap.xml" not in robots:
        errors.append("robots.txt peger ikke på produktions-sitemap")


def main() -> int:
    errors: list[str] = []
    warnings: list[str] = []
    audit_html(errors, warnings)
    audit_media(errors, warnings)
    audit_repo(errors, warnings)

    for warning in sorted(set(warnings)):
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}", file=sys.stderr)

    if errors:
        print(f"\nAudit fejlede med {len(errors)} fejl.", file=sys.stderr)
        return 1
    print(f"\nAudit bestået. {len(html_files())} HTML-sider kontrolleret; {len(set(warnings))} kendte medie-advarsler.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
