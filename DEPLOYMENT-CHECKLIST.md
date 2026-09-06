# DME – checklist før offentlig lancering

Denne liste indeholder kun ting, som ikke kan afsluttes korrekt inde i repositoryet alene.

## Medier

- [ ] Upload de manglende autentiske servicebilleder.
- [ ] Tilføj `banner-dme.webm`, hvis den ønskes som ekstra videokilde.
- [ ] Tilføj `assets/images/banner-dme-poster.webp` og kobl den på videoen.
- [ ] Lav responsive billedvarianter og opdatér `srcset`/`sizes`, når de endelige billeder er valgt.
- [ ] Fjern EXIF/GPS fra egne projektfotos.
- [ ] Kontrollér rettigheder/tilladelser til kunder, personer, adresser og nummerplader.
- [ ] Lav endeligt Open Graph-billede og eventuelle ydelsesspecifikke delingsbilleder.

## Verificerede virksomhedsoplysninger

Tilføj først disse, når de præcise oplysninger er verificeret:

- [ ] registreret virksomhedsnavn
- [ ] CVR-nummer
- [ ] telefonnummer
- [ ] offentlig fysisk adresse, hvis relevant
- [ ] reelt serviceområde
- [ ] eventuelle åbningstider

Når de er kendt, skal de bruges konsekvent i footer/kontakt, Privatliv og Organization/LocalBusiness structured data.

## Cloudflare

- [ ] Opret Pages-projektet med `master` som produktionsbranch.
- [ ] Tilknyt `dmemurer.dk` som det primære domæne.
- [ ] Konfigurér `www.dmemurer.dk` → `https://dmemurer.dk` som permanent redirect på Cloudflare zone-niveau.
- [ ] Aktivér/verify HTTP → HTTPS på zone-niveau.
- [ ] Kontrollér at `_headers` faktisk bliver sendt på produktion.
- [ ] Kontrollér at en ukendt URL viser `404.html` med HTTP-status **404**.
- [ ] Kontrollér trailing-slash redirects fra `_redirects`.
- [ ] Kontrollér at canonical URL på alle sider matcher den endelige produktion.
- [ ] Kontrollér at alle subdomæner, der skal bruges til web, understøtter HTTPS før `includeSubDomains` eventuelt føjes tilbage til HSTS.

## GitHub

- [ ] Beskyt `master` i repository settings.
- [ ] Kræv pull request før merge til `master`.
- [ ] Kræv den nye `Website quality gate` status check før merge.
- [ ] Slå direkte force-push til `master` fra.

## Manuel tilgængeligheds- og enhedstest

- [ ] Tastatur: hele siden uden mus.
- [ ] NVDA + Chrome/Firefox på Windows.
- [ ] VoiceOver + Safari på iPhone/macOS.
- [ ] Rigtig iPhone.
- [ ] Rigtig Android-telefon.
- [ ] 320 px viewport.
- [ ] 200 % browserzoom.
- [ ] `prefers-reduced-motion` – bannerfilm må ikke begynde at spille/downloade via JS-flow.
- [ ] Data Saver – bannerfilm skal springes over via JS-flow.
- [ ] Service-dialog: fokus ind, Escape, fokus tilbage til udløser.
- [ ] Opgavetype-dropdown: Enter/Space, Arrow Up/Down, Home, End, Escape, Tab.
- [ ] Formular med og uden konfigureret mailklient.

## Produktionstest

- [ ] Lighthouse på den rigtige Cloudflare-URL.
- [ ] Core Web Vitals efter de endelige medier er lagt ind.
- [ ] Alle interne links fra alle sider.
- [ ] Alle service-CTA'er og query-parametre til kontaktformularen.
- [ ] Privatliv → forside og forside → Privatliv.
- [ ] Mobilmenu på alle sidetyper.
- [ ] Open Graph-preview på relevante sociale tjenester.
- [ ] Schema.org/Google structured-data test.

## Efter lancering

- [ ] Tilføj `https://dmemurer.dk` i Google Search Console.
- [ ] Indsend `https://dmemurer.dk/sitemap.xml`.
- [ ] Inspicér homepage + alle ydelsessider og kontrollér Googles valgte canonical.
- [ ] Opdatér Privatliv før der senere tilføjes analytics, Turnstile, formularbackend eller andre tredjeparter.
