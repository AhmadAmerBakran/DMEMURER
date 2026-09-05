# DME Murerforretning

Professionel, statisk hjemmeside til **DME Murerforretning**. Sitet er lavet uden framework eller build-step, så det er hurtigt, enkelt at vedligeholde og velegnet til Cloudflare Pages.

## Indhold

- Responsivt one-page design
- Ydelser, virksomhedsprofil og arbejdsproces
- Kontaktformular, der opretter en e-mail til `info@dmemurer.dk`
- Privatlivsside
- SEO metadata, Open Graph og Schema.org structured data
- `robots.txt` og `sitemap.xml`
- Branded 404-side
- Cloudflare `_headers` med basale security headers
- Ingen analytics, marketingcookies eller tredjeparts JavaScript

## Lokal visning

Da sitet er rent HTML/CSS/JavaScript, kan det åbnes direkte, men en lokal webserver anbefales:

```bash
python3 -m http.server 8080
```

Åbn derefter `http://localhost:8080`.

## Deploy på Cloudflare Pages

1. Log ind på Cloudflare.
2. Gå til **Workers & Pages → Create → Pages → Connect to Git**.
3. Vælg repository `AhmadAmerBakran/DMEMURER`.
4. Production branch: `master`.
5. Framework preset: **None**.
6. Build command: lad feltet være tomt.
7. Build output directory: `/` eller repository root, afhængigt af Cloudflares aktuelle UI.
8. Deploy.
9. Tilføj `dmemurer.dk` og `www.dmemurer.dk` under **Custom domains**.

## Før offentlig lancering

Følgende bør bekræftes eller tilføjes, når oplysningerne er klar:

- At `info@dmemurer.dk` er oprettet og modtager mail.
- Virksomhedens telefonnummer, hvis det skal vises.
- CVR-nummer og fysisk adresse, hvis de skal fremgå af siden/footer.
- Det faktiske geografiske serviceområde, så lokal SEO kan målrettes korrekt.
- Egne billeder af udførte projekter. De vil være mere troværdige end stock-/Unsplash-billeder.
- Eventuelle certificeringer, garantiordninger eller medlemskaber må først tilføjes, når de er dokumenteret.

## Billeder

Den nuværende version bruger eksternt indlæste billeder fra Unsplash. De er valgt som midlertidigt visuelt materiale og bør senere erstattes med egne projektfotos. Når egne billeder ligger i repository, skal CSP-reglen i `_headers` også kunne strammes til kun at tillade `'self'` for billeder.

## Kontaktformular

Formularen gemmer eller sender ikke data til en server. JavaScript bygger en `mailto:`-henvendelse ud fra felterne og åbner brugerens e-mailprogram. Det gør løsningen enkel og privacy-friendly, men afhænger af at brugeren har en mailklient konfigureret.

En senere version kan bruge Cloudflare Workers/Pages Functions eller en ekstern form-service, hvis formularen skal sende direkte fra hjemmesiden.

## Filer

- `index.html` – hovedside og SEO-data
- `styles.css` – komplet design system og responsive styles
- `script.js` – navigation, scroll-animationer og kontaktformular
- `privatliv.html` – privatlivspolitik
- `404.html` – fejlside
- `favicon.svg` – favicon
- `_headers` – Cloudflare security/cache headers
- `robots.txt` – crawler-regler
- `sitemap.xml` – sitemap
