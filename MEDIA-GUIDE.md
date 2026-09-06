# Medievejledning til DME Murerforretning

Denne fil beskriver præcis, hvilke mediefiler hjemmesiden forventer, hvor de skal placeres, og hvilke mål der anbefales.

## Bannerfilm

Placering:

```text
assets/video/
```

Brug disse filnavne:

```text
banner-dme.webm
banner-dme.mp4
```

Anbefalet format:

- opløsning: **1920 × 1080 px**
- billedforhold: **16:9**
- længde: **8–15 sekunder**
- billedhastighed: **24–30 billeder pr. sekund**
- lyd: **ingen lyd**
- motiv: roligt, professionelt murerarbejde med god plads omkring det vigtigste motiv
- filstørrelse: hold den så lav som muligt uden synlige komprimeringsfejl; sigt gerne efter højst cirka **6–8 MB** pr. fil

Når filerne er lagt i mappen, fjernes kommentarerne omkring de to `<source>`-linjer i bannerets `<video>`-element i `index.html`.

Banneret er bevidst lavet, så filmen kan ses tydeligt. Der ligger kun en kontrolleret toning over filmen for at sikre læsbar tekst; der er ikke længere tunge grafiske lag, som skjuler motivet.

## Billeder til ydelser

Placering:

```text
assets/images/services/
```

Alle billeder bør leveres i:

- opløsning: **1800 × 1200 px**
- billedforhold: **3:2**
- filformat: **WebP**
- anbefalet filstørrelse: helst **under 350 KB** pr. billede
- motiv: ægte projektbilleder, hvis muligt

Brug præcis disse filnavne:

```text
service-nybyggeri.webp
service-fliser-klinker.webp
service-badevaerelser.webp
service-facader-fuger.webp
service-renovering.webp
service-tilbygning.webp
service-reparationer.webp
```

Hvis et billede endnu ikke er lagt ind, viser hjemmesiden automatisk en rolig, mørk reserveflade. Et manglende billede ødelægger derfor ikke kortets størrelse eller gitterets opbygning.

## Logo

Det aktive logo er:

```text
assets/images/dme-logo.svg
```

Logoet bruges direkte som SVG for at bevare skarphed på både mobil, almindelige skærme og skærme med høj pixeltæthed.

## Billede til deling på sociale medier

Fil:

```text
assets/images/og-dme.jpg
```

Anbefalet opløsning:

```text
1200 × 630 px
```

Billedet bruges, når forsiden deles på tjenester, der læser Open Graph-oplysninger.

## Praktiske billedråd

Undgå at lægge originale mobilfotos på 5–15 MB direkte i projektet. Beskær først til det anbefalede billedforhold, skaler til den anbefalede opløsning og eksportér derefter til WebP med en kvalitet, hvor mursten, fuger og kanter stadig står tydeligt.

Vælg billeder med rolig komposition. Servicekortene indeholder allerede tekst og bevægelse, så billeder med meget støj, store vandmærker eller tekst oven på motivet bør undgås.
