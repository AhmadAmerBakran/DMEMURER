# DME Murerforretning

Hjemmesiden til DME Murerforretning er en let statisk løsning bygget i ren HTML, CSS og JavaScript. Projektet er optimeret til Cloudflare Pages med fokus på hastighed, tilgængelighed, søgemaskineoptimering, sikkerhed, privatliv og enkel vedligeholdelse.

Der bruges ingen eksterne skrifttyper, analysetjenester eller tunge JavaScript-biblioteker. Det reducerer både indlæsningstid, tredjepartsrisiko og unødvendig datadeling.

## Projektets opbygning

```text
DMEMURER/
├── .github/workflows/quality.yml
├── .gitignore
├── 404.html
├── MEDIA-GUIDE.md
├── README.md
├── _headers
├── _redirects
├── index.html
├── privatliv.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.svg
├── favicon.png
├── styles.css
├── forbedringer.css
├── undersider.css
├── script.js
├── scripts/
│   ├── site_audit.py
│   └── check_lighthouse.py
├── assets/
│   ├── images/
│   │   ├── dme-logo.svg
│   │   ├── og-dme.jpg
│   │   └── services/
│   └── video/
└── ydelser/
    ├── index.html
    ├── nybyggeri/index.html
    ├── fliser-klinker/index.html
    ├── badevaerelse/index.html
    ├── facader-fuger/index.html
    ├── renovering/index.html
    ├── tilbygning/index.html
    └── murvaerk-reparation/index.html
```

`styles.css` er det fælles designsystem. `forbedringer.css` er et stabilt komponentlag til de dele, der ligger oven på grunddesignet: den brugerdefinerede opgavetypevælger, formularens byggeviser, Om DME-scenen, servicekortgenes ekstra links og Privatliv-siden. Det indlæses direkte fra HTML og er ikke længere afhængigt af JavaScript.

`undersider.css` indeholder de ekstra regler, som bruges på ydelsesoversigten og de enkelte ydelsessider. `script.js` håndterer navigation, bevægelse, ydelsesdialog, formular, tilpasset dropdown og betinget bannerafspilning.

## Lokal afprøvning

Der skal ikke installeres pakker for at køre selve hjemmesiden.

Start en webserver fra projektets rod:

```bash
python -m http.server 8080
```

På nogle Windows-installationer:

```bash
py -m http.server 8080
```

Åbn derefter:

```text
http://localhost:8080/
```

Kør den statiske kvalitetskontrol med:

```bash
python scripts/site_audit.py
node --check script.js
```

## Bannerfilm

Den aktive bannerfilm ligger her:

```text
assets/video/banner-dme.mp4
```

HTML-filen gemmer videostien i `data-src`. JavaScript sætter først den rigtige `src`, når brugeren ikke har valgt reduceret bevægelse eller Data Saver. Det betyder, at den tunge videofil undgås for brugere, der aktivt beder om mindre bevægelse eller lavere dataforbrug.

Når en WebM-version senere tilføjes, skal den ligge før MP4-kilden i `<video>`-elementet.

En poster-fil bør tilføjes, når den er klar. Se `MEDIA-GUIDE.md`.

## Billeder til ydelser

Hjemmesiden forventer følgende filer i `assets/images/services/`:

```text
service-nybyggeri.webp
service-fliser-klinker.webp
service-badevaerelser.webp
service-facader-fuger.webp
service-renovering.webp
service-tilbygning.webp
service-reparationer.webp
```

Manglende billeder ødelægger ikke layoutet. Servicekortene viser en kontrolleret reserveflade, indtil de rigtige billeder er tilgængelige.

Brug helst egne projektbilleder. Fjern EXIF/GPS-oplysninger fra billeder taget hos kunder, og publicér kun billeder, virksomheden har ret til at bruge.

## Kontaktformular

Kontaktformularen sender ikke oplysninger til en database. Den bygger en færdig e-mail på brugerens enhed og åbner den valgte mailklient.

Den synlige fallback-adresse er altid:

```text
info@dmemurer.dk
```

Det betyder, at brugeren stadig har en tydelig kontaktvej, hvis `mailto:` ikke er konfigureret på enheden.

Hvis der senere bygges en rigtig formularbackend på Cloudflare Workers/Pages Functions, skal Privatliv-siden opdateres samtidig, og løsningen skal have passende misbrugsbeskyttelse og dokumenteret databehandling.

## Tilgængelighed

Projektet indeholder blandt andet:

- spring-link til hovedindholdet
- semantiske regioner og overskrifter
- tastaturbetjent mobilnavigation
- native `<dialog>` med fokusretur til udløseren
- tastaturbetjent brugerdefineret opgavetypevælger
- `aria-live` til formularstatus
- reduceret bevægelse via `prefers-reduced-motion`
- video, der ikke startes ved reduceret bevægelse eller Data Saver
- almindelige crawlable links til alle ydelsessider, også uden JavaScript

Manuel test med VoiceOver/NVDA og rigtige mobile enheder skal stadig udføres før offentlig lancering.

## Søgemaskineoptimering

Sitet har særskilte sider for alle syv hovedydelser. De enkelte sider har egne titler, beskrivelser, kanoniske adresser og strukturerede data.

Projektet indeholder også:

- dansk semantisk indhold
- interne links mellem ydelser
- `robots.txt`
- `sitemap.xml`
- Schema.org JSON-LD
- Open Graph-data
- canonical URLs
- Cloudflare Pages-redirects for kendte URL-varianter

Virksomhedsoplysninger som CVR-nummer, telefonnummer, fysisk adresse og serviceområde må kun tilføjes, når de er verificeret.

## Sikkerhed og privatliv

`_headers` indeholder blandt andet:

- Content Security Policy
- HSTS
- beskyttelse mod framing
- `nosniff`
- stram referrer-policy
- begrænset adgang til kamera, mikrofon, geolocation m.m.
- cross-origin-isolation-relaterede headers

Medier bruger ikke længere `immutable`, fordi de nuværende menneskelæsbare filnavne skal kunne erstattes uden at efterlade en gammel version i browserens cache i en måned.

Sitet bruger ingen tredjepartsanalyse, annoncering eller tracking i den nuværende udgave.

## Automatiske kvalitetskontroller

`.github/workflows/quality.yml` kører ved pull requests og ved pushes til `master`.

Den kontrollerer:

- interne links og lokale filer
- dublerede HTML-id'er
- meta description, title, canonical og `lang`
- gyldig JSON-LD
- nødvendige sikkerheds-/deployfiler
- maksimumstørrelse på bannerfilm og servicebilleder
- kendte udvikler-placeholdertekster
- JavaScript-syntaks
- Lighthouse på forsiden

Nuværende Lighthouse-minimum i CI:

```text
Performance:      80
Accessibility:    95
Best Practices:   95
SEO:              95
```

Når alle endelige medier er på plads, bør Performance-grænsen hæves, hvis den stabile produktionstest tillader det.

## Cloudflare Pages

Projektet er struktureret, så repository-roden kan bruges som statisk output.

`_headers` og `_redirects` ligger i roden og læses af Cloudflare Pages. Hostname-redirect fra `www.dmemurer.dk` til `dmemurer.dk` samt tvungen HTTP → HTTPS skal konfigureres på Cloudflare zone-niveau, fordi Pages `_redirects` ikke understøtter domænebaserede redirects.

Efter deployment skal de faktiske response headers, 404-status, redirects og canonical URL'er verificeres på det rigtige domæne.

## Mediefiler

Se `MEDIA-GUIDE.md` for filnavne, størrelser og den anbefalede billed-/videoproces.
