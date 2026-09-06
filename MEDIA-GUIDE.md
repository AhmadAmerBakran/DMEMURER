# Medievejledning til DME Murerforretning

Denne fil beskriver de produktionsmedier, hjemmesiden forventer, og hvordan de bør klargøres før upload.

## Bannerfilm

Placering:

```text
assets/video/
```

Aktiv fil:

```text
banner-dme.mp4
```

Fremtidig ekstra kilde:

```text
banner-dme.webm
```

Anbefaling:

- opløsning: **1920 × 1080 px**
- billedforhold: **16:9**
- længde: **8–15 sekunder**
- billedhastighed: **24–30 fps**
- lyd: fjern lydsporet helt
- MP4: H.264, `yuv420p`, web/fast-start
- WebM: komprimeret alternativ, helst mindre end MP4
- maksimum i projektets CI: **15 MiB** for MP4
- praktisk mål: cirka **4–10 MB**, hvis kvaliteten stadig er ren

Banneret indlæses betinget. Brugere med `prefers-reduced-motion` eller Data Saver får ikke startet videodownloaden via den normale JavaScript-flow.

## Banner-poster

Når en god frame er valgt, tilføj:

```text
assets/images/banner-dme-poster.webp
```

Anbefaling:

- 1920 × 1080 px
- WebP
- cirka 100–250 KB
- motiv og beskæring skal matche den første synlige videoframe så tæt som muligt

Posterfilen er endnu ikke i projektet og må først kobles til `<video>`, når den faktiske fil er uploadet.

## Billeder til ydelser

Placering:

```text
assets/images/services/
```

Brug præcis disse hovedfilnavne:

```text
service-nybyggeri.webp
service-fliser-klinker.webp
service-badevaerelser.webp
service-facader-fuger.webp
service-renovering.webp
service-tilbygning.webp
service-reparationer.webp
```

Hovedbilleder:

- opløsning: **1800 × 1200 px**
- billedforhold: **3:2**
- format: **WebP**
- mål: cirka **200–350 KB**
- CI-grænse: **450 KiB** pr. `service-*.webp`

Når de endelige billeder er klar, bør der også laves responsive varianter omkring:

```text
640 px bred
960 px bred
1400 px bred
1800 px bred
```

De kan derefter kobles på med `srcset` og `sizes`, så mobile enheder ikke behøver hente desktopversionen.

## Fotoarbejdsgang

For egne projektbilleder:

1. Vælg billeder med rolig komposition og tydeligt håndværk.
2. Beskær ensartet til 3:2.
3. Ret hvidbalance, eksponering og perspektiv uden at få billedet til at se kunstigt ud.
4. Hold farvebehandlingen ens på tværs af alle syv ydelser.
5. Fjern EXIF/GPS-metadata før publicering.
6. Kontrollér at der ikke vises kunders navne, adresser, nummerplader eller personer uden relevant tilladelse.
7. Eksportér først derefter de endelige WebP-varianter.

## Logo

Det aktive logo er:

```text
assets/images/dme-logo.svg
```

Logoet beholdes som det er.

## Billede til deling på sociale medier

Nuværende fil:

```text
assets/images/og-dme.jpg
```

Opløsning:

```text
1200 × 630 px
```

Når de autentiske DME-projektbilleder er klar, bør der laves en ny bevidst social komposition. De enkelte ydelsessider kan også få egne relevante Open Graph-billeder senere.

## Cache og udskiftning

Mediefilerne bruger menneskelæsbare, stabile filnavne og er derfor **ikke** markeret `immutable` i `_headers`.

Det gør det muligt at erstatte et billede eller en video uden at en browser nødvendigvis holder fast i den gamle fil i en hel måned. Hvis projektet senere går over til filnavne med indholdshash, kan lang `immutable` cache aktiveres igen.
