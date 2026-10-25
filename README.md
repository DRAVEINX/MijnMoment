# MijnMoment

**Jouw dag. Jouw keuzes. Jouw moment.**

MijnMoment is een zelfstandige, gratis en toegankelijke cliëntenapp. Android-versie 1.0.1 bevat de opstartreparatie die op een Android-telefoon is getest. De app heeft geen betaalmuur en geen begeleidersportaal.

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

## Ondertekende Android-versie 1.0.1
De workflow `.github/workflows/signed-release.yml` maakt een ondertekende release-APK en Google Play-AAB met versiecode 3. De release wordt gestart via handmatige workflow op `main` of het release-request-bestand `.github/release-request/v1.0.1.txt`. De ondertekeningssleutel wordt via een versleutelde back-up in de repository bewaard; het herstelwachtwoord blijft noodzakelijk als GitHub Actions-secret `MM_RELEASE_RECOVERY_PASSWORD`.

**Overstap vanaf debug-APK:** de release-APK heeft een andere handtekening. Verwijder de debug-app niet zonder eerst een gecontroleerde back-up via **Jij in beeld > Back-up downloaden** te maken. Controleer of het gedownloade bestand werkelijk beschikbaar en leesbaar is voordat je overstapt. Zet daarna gegevens terug via **Back-up terugzetten**. Werkt de back-upfunctie niet, behoud dan de huidige installatie met gegevens.

## Belangrijke beperkingen
De releasebestanden zijn nog niet gepubliceerd in Google Play. Voor Google Play zijn onder andere privacyverklaring, app-vermelding, beleidseisen en aanvullende tests vereist. Voor een release zijn onder meer een gecontroleerde releasebuild, veilige ondertekening met een eigen keystore en echte apparaattests nodig. Er is nog geen cloudsync, online account, serveropslag, versleutelde synchronisatie of Android-systeemmeldingen. Lokale gegevens staan op het apparaat en kunnen verloren gaan als browsergegevens worden gewist. De browserfunctie voor voorlezen verschilt per apparaat. Spraakherkenning kan afhankelijk van de browser of het apparaat via een externe dienst worden verwerkt; gebruik deze functie daarom niet voor gevoelige informatie zonder de privacy-instellingen van je browser te controleren.

## Privacy en kosten
Het prototype gebruikt geen backend of betaalde functies. Er wordt geen cloudaccount aangemaakt. Gebruik voor gevoelige informatie alleen een apparaat en browser die je vertrouwt.
