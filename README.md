# DME Murerforretning

Hjemmesiden til DME Murerforretning er bygget som en let, statisk løsning med fokus på hastighed, tilgængelighed, søgemaskineoptimering, sikkerhed og et sammenhængende visuelt udtryk.

Siden bruger ren HTML, CSS og JavaScript uden eksterne skrifttyper, analysetjenester eller tunge programbiblioteker. Det holder indlæsningen enkel og mindsker både vedligeholdelse og unødvendige tredjepartsforbindelser.

## Projektets opbygning

```text
DMEMURER/
├── index.html
├── styles.css
├── undersider.css
├── script.js
├── 404.html
├── privatliv.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── favicon.svg
├── favicon.png
├── _headers
├── MEDIA-GUIDE.md
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

`styles.css` indeholder det fælles designsystem og hele forsiden. `undersider.css` indeholder de ekstra regler, som bruges på ydelsesoversigten og de enkelte ydelsessider. `script.js` samler sidens bevægelse, navigation, ydelsesvindue og kontaktformularens funktioner.

## Lokal afprøvning

Der skal ikke installeres ekstra pakker.

Kør en enkel lokal webserver fra projektmappen:

```bash
python -m http.server 8080
```

På nogle Windows-installationer bruges i stedet:

```bash
py -m http.server 8080
```

Åbn derefter `http://localhost:8080/` i browseren.

En lokal webserver er bedre end at åbne filerne direkte, fordi absolutte stier som `/styles.css` og `/assets/...` dermed opfører sig på samme måde som på det rigtige domæne.

## Visuelt udtryk

Designet tager udgangspunkt i DME-logoets sorte og gyldne udtryk. Forsiden bruger store, moderne overskrifter, tydelig kontrast og byggeinspirerede detaljer uden at gøre grænsefladen tung.

Bevægelse bruges med et formål:

- ydelseskortene ligger i et stabilt gitter og åbner deres oplysninger i et separat vindue
- kontaktformularens aktive felt får en animeret murerlinje
- en lille mur vokser i takt med, at formularens nødvendige oplysninger udfyldes
- afsnit kommer roligt frem ved rulning
- alle bevægelser respekterer brugerens valg om reduceret bevægelse

## Bannerfilm

Forsiden har en dedikeret plads til en lokal bannerfilm. Brug:

```text
assets/video/banner-dme.webm
assets/video/banner-dme.mp4
```

De to kildehenvisninger ligger allerede som kommentarer i `index.html`. Når filmfilerne er lagt i mappen, fjernes kommentarerne omkring kildehenvisningerne.

Banneret er bevidst holdt rent, så filmen forbliver synlig. Teksten ligger oven på en kontrolleret toning i venstre side i stedet for et stort lag af dekorative elementer.

De nøjagtige anbefalinger til opløsning, varighed og filstørrelse står i `MEDIA-GUIDE.md`.

## Billeder til ydelser

Hjemmesiden forventer disse filer i `assets/images/services/`:

```text
service-nybyggeri.webp
service-fliser-klinker.webp
service-badevaerelser.webp
service-facader-fuger.webp
service-renovering.webp
service-tilbygning.webp
service-reparationer.webp
```

Hvis et billede mangler, viser siden automatisk en rolig reserveflade, så kortenes størrelse og opbygning ikke brydes.

Brug helst egne projektbilleder. De giver en mere troværdig præsentation af virksomheden end generiske billeder.

## Kontaktformular

Kontaktformularen sender ikke oplysninger til en database. Når den besøgende trykker på sendeknappen, oprettes en e-mail i den besøgendes eget e-mailprogram.

Links fra de enkelte ydelsessider kan sende den valgte ydelse med tilbage til forsiden. Formularen læser valget og udfylder opgavetypen automatisk.

## Søgemaskineoptimering

Sitet har en særskilt side for hver af de syv hovedydelser. De enkelte sider har egne overskrifter, beskrivelser, kanoniske adresser og strukturerede oplysninger.

Derudover indeholder projektet:

- semantisk HTML
- danske beskrivelser og sidetitler
- intern sammenkobling mellem ydelserne
- `robots.txt`
- `sitemap.xml`
- strukturerede oplysninger efter Schema.org
- oplysninger til deling på sociale tjenester

Virksomhedsoplysninger som CVR-nummer, telefonnummer, offentlig adresse, serviceområde og åbningstider bør først tilføjes, når de er verificeret. De må ikke gættes.

## Sikkerhed og privatliv

`_headers` indeholder blandt andet beskyttelse mod indlejring, begrænset adgang til enhedsfunktioner, stram indholdspolitik og sikker transport over HTTPS.

Hjemmesiden bruger i den nuværende udgave ingen statistik-, annoncerings- eller sporingsværktøjer fra tredjepart. Kontaktformularens oplysninger gemmes ikke på hjemmesiden.

## Mediefiler

Se `MEDIA-GUIDE.md` for de præcise filnavne og anbefalede mål til bannerfilm, ydelsesbilleder, logo og delingsbillede.
