# MijnMoment – voorbereiding Google Play (concept, te controleren)

> Dit document is een publicatiechecklist en bevat conceptteksten. Publiceer de app pas nadat de uitgever de verklaringen, de distributiebestanden en de storevermelding heeft gecontroleerd.

## Huidige bronversie
- Appnaam: MijnMoment
- Package-ID: `nl.draveinx.mijnmoment`
- Huidige hoofdbranch-release (25 oktober 2026): `1.0.1`, Android versionCode `3`.
- GitHub Actions: `.github/workflows/signed-release.yml` produceert de ondertekende `MijnMoment-1.0.1-google-play.aab`. Controleer de **actuele, groene** workflowrun; een eerder groen resultaat kan van versie 1.0.0 zijn.
- Gebruik de `.aab` voor Google Play, niet de APK. Houd herstelwachtwoord en versleutelde keystoreback-up veilig en privé. Geef ze nooit aan testers.
- De bestaande, werkende debug-app niet verwijderen zonder eerst een volledige en controleerbare back-up te maken.

## Nederlandse Play Store-beschrijving (concept)

**Naam:** MijnMoment

**Korte beschrijving:** Meer grip op je dag met planning, gevoelens, afspraken en een dagboek

**Volledige beschrijving:**

MijnMoment helpt je om overzicht en rust in je dag te brengen, op jouw tempo en op een manier die bij je past.

Plan taken en vink ze af. Bekijk je week, houd afspraken bij en geef met een eenvoudige gevoelsmeter aan hoe je je voelt. Schrijf je gedachten in een dagboek, werk aan kleine dagelijkse doelen en maak een tekening. Met de communicatiefunctie kun je korte zinnen kiezen, typen en waar ondersteund laten voorlezen.

Je gebruikt MijnMoment zonder account of abonnement. Gegevens worden standaard lokaal op je apparaat opgeslagen. In de instellingen kun je een back-up downloaden of je gegevens verwijderen.

MijnMoment: jouw dag. Jouw keuzes. Jouw moment.

Let op: functies voor inspreken en voorlezen hangen af van je toestel. Spraakherkenning kan een externe dienst gebruiken.

## Privacybeleid vereist – nog af te ronden
Google Play vereist een publiek HTTPS-adres voor een privacybeleid en een verwijzing of tekst in de app zelf. De huidige releaseversie moet hiervoor nog worden aangepast. Verifieer vóór de definitieve tekst:
- Juridische naam/ontwikkelaarsnaam op het Play-account, en een publiek support-/privacycontactadres. **Nog niet ingevuld.**
- De actuele Android-appmachtigingen en alle SDK's.
- Lokaal opgeslagen gegevens: taken, afspraken, stemming, dagboek, doelen, voorkeuren en tekeningen.
- Geen eigen MijnMoment-server of gebruikersaccounts in de huidige broncode.
- Bij spraakherkenning kan verwerking door toestel/browser of diens externe spraakdienst plaatsvinden.
- Lokale opslag is niet automatisch hetzelfde als end-to-end versleutelde opslag.
- Verwijderen kan via de app; eerder gedownloade back-ups moet de gebruiker apart verwijderen.
- Houd het privacybeleid en de antwoorden op de Play Console-vragen over Gegevensveiligheid volledig in overeenstemming. Claim niet zonder controle dat er 'geen gegevens' worden gedeeld.

## Wat de uitgever in Google Play Console moet doen
1. Ontwikkelaarsaccount aanmaken of openen, registratie (€-tegenwaarde van eenmalig US$ 25), identiteits- en contactverificatie voltooien.
2. App aanmaken als gratis Android-app, met Nederlands als standaardtaal.
3. Een privacybeleid publiceren op een echt bereikbaar, publiek HTTPS-adres en de URL in Play Console invullen. Het privacybeleid ook vanuit MijnMoment bereikbaar maken.
4. Winkelvermelding en support-e-mail invullen. Maak eigen icon (512×512 PNG), feature graphic (1024×500) en minstens twee echte screenshots met fictieve testgegevens.
5. Verplichte formulieren invullen: doelgroep, advertenties, app-toegang, inhoudsclassificatie, gegevensveiligheid, eventuele andere verklaringen.
6. App met nieuwe ondertekende `.aab` eerst in **Intern testen** uploaden en installeren via Google Play. Test gegevensopslag, navigatie en back-up/herstellen. Controleer het pre-launch report.
7. Voor nieuwe persoonlijke Play-accounts (aangemaakt na 13 november 2023): minimaal twaalf deelnemers veertien dagen doorlopend aan een gesloten test laten deelnemen; dan productietoegang aanvragen.
8. Na goedkeuring naar Productie uitrollen. Volgende versiecode groter kiezen dan de vorige upload.

## Bronverwijzingen Google
- https://support.google.com/googleplay/android-developer/answer/6112435
- https://support.google.com/googleplay/android-developer/answer/14151465
- https://developer.android.com/google/play/requirements/target-sdk
- https://support.google.com/googleplay/android-developer/answer/10144311
- https://support.google.com/googleplay/android-developer/answer/9866151
- https://support.google.com/googleplay/android-developer/answer/9842756
