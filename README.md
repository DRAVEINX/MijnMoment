# MijnMoment

**Jouw dag. Jouw keuzes. Jouw moment.**

MijnMoment is een zelfstandige, gratis en toegankelijke cliëntenapp in ontwikkeling. De app heeft geen betaalmuur en geen begeleidersportaal.

## Functies
- Dagplanning met taken die je kunt afvinken
- Afspraken met datum en tijd, inclusief controle op dubbele tijdstippen
- Gevoelsmeter groen, oranje en rood met rustsuggesties
- Communicatiezinnen en tekst laten voorlezen via de browser
- Spraaknotities via browser-spraakherkenning waar ondersteund
- Instelbare tekstgrootte en hoog contrast
- Persoonlijk dagboek, lokaal op het apparaat opgeslagen
- Tekenvlak met PNG-download
- Kleine doelen en routines
- Export en verwijderen van lokale gegevens
- PWA-manifest en service worker voor basis offlinegebruik
- Grote knoppen, responsieve indeling en toetsenbordfocus

## Lokaal testen
Vereist Node.js 22 of hoger voor de checks.

```sh
node --check app.js
node scripts/smoke-test.mjs
```

Open `index.html` voor een eenvoudige lokale preview. Voor service-worker- en installeerfuncties moet je de app via localhost of HTTPS aanbieden.

## GitHub Actions
De workflow `.github/workflows/checks.yml` controleert de JavaScript-syntax, voert rooktests uit, controleert essentiële bestanden en uploadt de webbestanden als `mijnmoment-web` artifact.

## Belangrijke beperkingen
Dit is versie 0.6.0 van het webprototype, nog geen releaseklare Android-app. Er is nog geen APK/AAB, cloudsync, online account, serveropslag, versleutelde synchronisatie of Android-systeemmeldingen. Lokale gegevens staan op het apparaat en kunnen verloren gaan als browsergegevens worden gewist. De browserfunctie voor voorlezen verschilt per apparaat.

## Privacy en kosten
Het prototype gebruikt geen backend of betaalde functies. Er wordt geen cloudaccount aangemaakt. Gebruik voor gevoelige informatie alleen een apparaat en browser die je vertrouwt.
