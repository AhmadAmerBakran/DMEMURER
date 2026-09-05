# DME Murerforretning

Produktionsklar, statisk hjemmeside til **DME Murerforretning** med fokus på høj hastighed, tydelig informationsarkitektur, teknisk SEO og et visuelt udtryk, der følger virksomhedens sorte/guld/sølv-logo.

Sitet er bevidst lavet i ren **HTML, CSS og JavaScript**. Der er ingen framework-runtime, ingen npm-afhængigheder, ingen webfonts, ingen tracking og intet build-step.

## Arkitektur

```text
DMEMURER/
├── index.html
├── styles.css
├── script.js
├── 404.html
├── privatliv.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.svg
├── _headers
├── assets/
│   └── images/
│       ├── dme-logo.webp
│       └── og-dme.jpg
└── ydelser/
    ├── index.html
    ├── badevaerelse/index.html
    ├── fliser-klinker/index.html
    ├── facader-fuger/index.html
    ├── renovering/index.html
    └── murvaerk-reparation/index.html
```

## Lokal udvikling

Du behøver **ikke** køre `npm install`.

### WebStorm

Åbn `index.html`, højreklik og vælg **Open In → Browser**.

### Lokal HTTP-server

Fra repository-mappen:

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

Det er bedre at teste gennem en lokal HTTP-server end via `file://`, fordi absolutte paths som `/styles.css` og `/assets/...` så opfører sig på samme måde som på det rigtige domæne.

## Designprincipper

Designet er bygget ud fra det officielle DME-logo:

- sort/kulsort baggrund
- metallic guld som primær accent
- sølv/grå som sekundær accent
- meget begrænset brug af dekorative effekter
- store overskrifter, høj kontrast og tydeligt visuelt hierarki
- ingen tunge UI-biblioteker eller animationspakker
- animationer respekterer `prefers-reduced-motion`

## Banner-video

Forsiden har allerede et dedikeret video-slot i `index.html`:

```html
<video class="hero-video" autoplay muted loop playsinline preload="none">
  <source src="/assets/video/hero.webm" type="video/webm">
  <source src="/assets/video/hero.mp4" type="video/mp4">
</video>
```

Når den rigtige video er klar:

1. Opret mappen `assets/video/`.
2. Læg en komprimeret `hero.webm` i mappen.
3. Læg gerne en MP4-version som fallback.
4. Tilføj de to `<source>`-linjer i det eksisterende `<video>`-element.
5. Hold videoen kort, uden lyd og optimeret til web. Videoen er dekorativ; vigtig tekst ligger derfor altid som rigtig HTML oven på banneret.

Videoen er **ikke** nødvendig for at siden fungerer. Indtil videoen tilføjes, vises den lette CSS-baserede hero-baggrund.

## Billeder bundet til ydelser

Der er faste billed-slots på forsiden og de enkelte ydelsessider:

- `badevaerelse`
- `fliser-klinker`
- `facader-fuger`
- `renovering`
- `murvaerk-reparation`

De er markeret med `data-image-slot`, så det er tydeligt hvilket projektfoto der hører til hvilken ydelse.

Når rigtige projektbilleder er klar, anbefales denne struktur:

```text
assets/images/services/
├── badevaerelse.webp
├── fliser-klinker.webp
├── facader-fuger.webp
├── renovering.webp
└── murvaerk-reparation.webp
```

Brug helst egne projektfotos. De giver både større troværdighed og bedre lokal relevans end generiske stockfotos.

Til et synligt billede bør der bruges et rigtigt `<img>`/`<picture>`-element med præcis dansk alt-tekst. Dekorative billeder skal have tom alt-tekst eller være skjult for hjælpemidler.

## Billedoptimering

Anbefalet:

- AVIF som første format, hvor workflowet tillader det
- WebP som bred fallback
- original JPEG kun når nødvendigt
- korrekt `width` og `height` på alle billeder for at undgå layout shift
- `loading="lazy"` på billeder under første skærmbillede
- hero/logo, der er synlige med det samme, må ikke lazy-loades
- upload ikke 5-10 MB mobilfotos direkte til produktion

Et projektfoto, der vises omkring 1200 px bredt, bør som udgangspunkt ikke leveres som en 5000-6000 px original.

## SEO-struktur

Sitet har nu en sidearkitektur, hvor hver vigtig ydelse har sin egen URL og unikke danske tekst:

- `/ydelser/`
- `/ydelser/badevaerelse/`
- `/ydelser/fliser-klinker/`
- `/ydelser/facader-fuger/`
- `/ydelser/renovering/`
- `/ydelser/murvaerk-reparation/`

SEO-grundlaget omfatter blandt andet:

- én tydelig H1 pr. vigtig side
- unikke title-tags og meta descriptions
- canonical URL
- `hreflang="da-DK"`
- Open Graph metadata
- optimeret lokalt social-share billede
- Schema.org JSON-LD for Organization, WebSite, WebPage, Service, ItemList og BreadcrumbList, hvor det er relevant
- semantisk HTML
- intern linking mellem forsiden, ydelsesoversigten og detail-siderne
- XML sitemap
- robots.txt
- crawlbare tekstlinks; vigtig navigation afhænger ikke af JavaScript
- ingen keyword-stuffing eller skjult SEO-tekst

### Lokal SEO kan først færdiggøres med verificerede virksomhedsoplysninger

Følgende må **ikke** gættes eller opfindes. Når oplysningerne er bekræftet, skal de tilføjes ensartet til website, Schema.org og Google Business Profile:

- officielt virksomhedsnavn
- CVR-nummer
- telefonnummer
- offentlig adresse, hvis virksomheden har en adresse kunder skal se
- faktisk serviceområde/byer
- åbningstider eller telefontider
- Google Business Profile-link
- dokumenterede certificeringer/medlemskaber

Når det faktiske serviceområde er kendt, kan lokale landingssider overvejes. De bør kun oprettes, hvis DME reelt betjener området, og hver side skal have reelt, unikt indhold – ikke kopieret tekst med bynavnet skiftet ud.

## Kontaktformular

Formularen sender ikke personoplysninger til en backend. JavaScript bygger en `mailto:`-henvendelse og åbner brugerens eget e-mailprogram med oplysningerne udfyldt.

Fordele:

- ingen formulardatabase
- ingen ekstern form-service
- meget lille angrebsflade
- ingen ekstra JavaScript-pakke

Ulempe:

- brugeren skal have en mailklient konfigureret

Hvis der senere ønskes direkte afsendelse fra siden, er en Cloudflare Pages Function/Worker med server-side validering og spam-beskyttelse et naturligt næste skridt.

## Privatliv

Den nuværende version:

- bruger ikke Google Analytics
- bruger ikke Meta Pixel
- bruger ikke marketingcookies
- bruger ikke eksterne webfonts
- indlæser ikke tredjepartsbilleder
- indlejrer ikke YouTube, Maps eller sociale medier

Hvis en af disse funktioner tilføjes senere, skal privatlivsteksten og eventuel cookie-håndtering vurderes på ny.

## Performance

Siden er optimeret til en meget lille klient-runtime:

- statisk HTML
- én CSS-fil
- én lille JavaScript-fil
- lokale brand-assets
- ingen framework hydration
- ingen tredjeparts-JavaScript
- ingen eksterne fonte
- `content-visibility` på lange sektioner
- lazy loading kan bruges på fremtidige projektfotos
- reducerede animationer ved `prefers-reduced-motion`
- Cloudflare-cache headers for statiske assets

Når egne billeder/videoer bliver tilføjet, vil deres filstørrelse være den vigtigste performance-faktor.

## Security headers

`_headers` er lavet til Cloudflare Pages og indeholder blandt andet:

- Content Security Policy
- HSTS
- `X-Content-Type-Options`
- `X-Frame-Options`
- Referrer Policy
- Permissions Policy
- Cross-Origin-Opener-Policy
- cache-regler

Hvis tredjepartsindhold senere tilføjes, skal CSP opdateres bevidst frem for at åbnes bredt.

## Deploy på Cloudflare Pages

1. Log ind på Cloudflare.
2. Gå til **Workers & Pages**.
3. Opret et Pages-projekt og forbind GitHub.
4. Vælg `AhmadAmerBakran/DMEMURER`.
5. Production branch: `master`.
6. Framework preset: **None**.
7. Build command: tomt felt.
8. Output/build directory: repository root (`/`) efter den mulighed Cloudflares aktuelle UI viser.
9. Deploy.
10. Tilføj `dmemurer.dk` som custom domain.
11. Vælg én canonical host (`dmemurer.dk` eller `www.dmemurer.dk`) og redirect den anden konsekvent til den valgte host.

## Før offentlig lancering

Kontrollér mindst følgende:

- `info@dmemurer.dk` eksisterer og kan modtage e-mail
- officielt virksomhedsnavn er stavet korrekt
- CVR, telefon, adresse og serviceområde er verificeret
- rigtige projektfotos er lagt ind
- hero-video er komprimeret, hvis den skal bruges
- formularen er testet på mobil og desktop
- alle sider returnerer HTTP 200
- 404-siden returnerer HTTP 404 gennem hostingplatformen
- både `robots.txt` og `sitemap.xml` kan åbnes offentligt
- domænet er tilføjet i Google Search Console
- sitemap er indsendt i Search Console
- Google Business Profile er korrekt opsat og matcher website-oplysningerne

## Git efter ændringer på remote

Hvis repository er klonet lokalt, og der er kommet nye commits på GitHub:

```bash
git status
git pull origin master
```

Hvis `git status` viser lokale ændringer, så commit eller stash dem først, før du puller.
