# MijnMoment – test op een Android-telefoon

Dit is een **testversie**, geen publieke release. Gebruik eerst fictieve gegevens. Een geslaagde GitHub-build bewijst niet dat alle functies op elk toestel werken.

## Installeren
1. Open [GitHub Actions](https://github.com/DRAVEINX/MijnMoment/actions) en kies de nieuwste **geslaagde** workflow **MijnMoment Android build** op `main`.
2. Open **Artifacts** en download het Android-testbestand. Pak het ZIP-bestand uit als dat nodig is.
3. Installeer alleen een APK uit je eigen vertrouwde GitHub-repository op een testtoestel. Een AAB is niet direct te installeren. Android kan vragen om toestemming voor installatie buiten de Play Store; schakel die toestemming na de test weer uit.
4. Start MijnMoment. Noteer toestelmodel, Android-versie en app-versie.

## Testchecklist
Vink elke stap pas af na een echte test.

- [ ] App opent zonder fout en alle acht starttegels zijn bereikbaar.
- [ ] Taken toevoegen, afvinken, verwijderen; na afsluiten en heropenen blijft de juiste stand staan.
- [ ] Afspraken toevoegen en verwijderen; een dubbel tijdstip wordt tegengehouden.
- [ ] Gevoel kiezen en drie kleine stapjes aanvinken; keuzes blijven na herstart behouden.
- [ ] Dagboek schrijven, bewaren en opnieuw openen; wissen vraagt om bevestiging.
- [ ] Tekening maken, heropenen, downloaden en wissen.
- [ ] Communicatiezinnen kiezen en bewerken; voorlezen werkt of toont een duidelijke melding.
- [ ] Spraakherkenning werkt waar ondersteund, of geeft begrijpelijk aan dat dit niet kan. Gebruik geen gevoelige testinformatie.
- [ ] Tekst vergroten en hoog contrast aanzetten; tekst en knoppen blijven leesbaar.
- [ ] Bediening met TalkBack en, indien mogelijk, toetsenbord: volgorde, labels en statusmeldingen zijn begrijpelijk.
- [ ] Back-up downloaden; gegevens aanpassen; back-up terugzetten en de herstelde gegevens controleren.
- [ ] Ongeldige back-up weigeren zonder bestaande gegevens te veranderen.
- [ ] App één keer online openen; vliegtuigmodus inschakelen; app afsluiten en opnieuw openen. Controleer planning, afspraken, dagboek en tekenen offline. Test ook opnieuw na herstart van het toestel.
- [ ] Na het uitschakelen van vliegtuigmodus werkt de app nog steeds.
- [ ] Controleer dat verwijderen van lokale gegevens alleen gebeurt na bevestiging. Maak eerst een back-up.

## Problemen vastleggen
Noteer bij elke fout: **stap**, **verwacht resultaat**, **werkelijk resultaat**, **toestel/Android-versie** en eventueel een screenshot zonder privégegevens. Meld fouten in [GitHub Issues](https://github.com/DRAVEINX/MijnMoment/issues).

## Wanneer klaar voor de volgende fase?
Pas na een geslaagde CI, een bruikbare APK, de checklist op minimaal één echt Android-toestel en het oplossen van blokkerende fouten kan de testversie als kandidaat voor een stabiele versie worden beoordeeld. Voor publicatie in Google Play zijn extra release- en beveiligingsstappen nodig.
