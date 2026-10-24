import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const file of ['index.html','styles.css','app.js','manifest.webmanifest','sw.js','assets/mijnmoment-icon.svg']) assert.ok(existsSync(file),`Bestand ontbreekt: ${file}`);
const html=readFileSync('index.html','utf8');
for (const feature of ['MijnMoment','planning','afspraken','communicatie','dagboek','tekenen','doelen','instellingen','gevoelens','section-intro','tile-icon','site-footer','dictate-diary','font-larger','contrast-toggle']) assert.ok(html.includes(feature),`HTML mist functie: ${feature}`);
const js=readFileSync('app.js','utf8');
for (const feature of ['localStorage','appointment-form','appointment-list','conflict','speechSynthesis','download-drawing','SpeechRecognition','highContrast','fontScale']) assert.ok(js.includes(feature),`JavaScript mist functie of controle: ${feature}`);
assert.ok(js.includes("area.value=b.dataset.phrase;area.focus();"),'Een gekozen communicatiezin moet direct bewerkbaar zijn');
const manifest=JSON.parse(readFileSync('manifest.webmanifest','utf8'));
assert.equal(manifest.name,'MijnMoment');
assert.equal(manifest.display,'standalone');
assert.equal((html.match(/class="panel feature" hidden/g)||[]).length,7,'Alle zeven functies moeten standaard verborgen zijn op het startscherm');
const capacitor=JSON.parse(readFileSync('capacitor.config.json','utf8'));
assert.equal(capacitor.appId,'nl.draveinx.mijnmoment');
assert.equal(capacitor.webDir,'dist');
assert.ok(readFileSync('app.js','utf8').includes("padStart(2,'0')"),'Datumveld moet een stabiele ISO-datum gebruiken');

const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
assert.equal(ids.length,new Set(ids).size,'HTML mag geen dubbele id-attributen bevatten');
const referencedIds=[...js.matchAll(/\$\('#([a-zA-Z0-9_-]+)'\)/g)].map(match=>match[1]);
for(const id of referencedIds) assert.ok(ids.includes(id),`JavaScript verwijst naar ontbrekend HTML-element: #${id}`);
assert.ok(html.includes('aria-live="polite"'),'Statusmeldingen moeten toegankelijk worden aangekondigd');
assert.ok(html.includes('id="task-status" aria-live="polite"'),'Taakstatus moet toegankelijk worden aangekondigd');
assert.ok(js.includes("if(!persist()){data.tasks.pop();renderTasks();")&&js.includes("$('#task-status').textContent='Taak toegevoegd en opgeslagen: '+text"),'Nieuwe taak moet alleen succesvolle opslag bevestigen');
assert.ok(js.includes("'Taak verwijderd: '+removed.text"),'Verwijderen van taak moet een bevestiging tonen');
assert.ok(html.includes('id="drawing-status" aria-live="polite"'),'Tekeningstatus moet toegankelijk worden aangekondigd');
assert.ok(js.includes("if(!persist()){data.drawing=previousDrawing;")&&js.includes("$('#drawing-status').textContent='Je tekening is gewist.'"),'Wissen van tekening moet alleen na succesvolle opslag het canvas wissen');
assert.ok(js.includes("$('#drawing-status').textContent='Je tekening wordt gedownload als PNG.'"),'Downloaden van tekening moet een bevestiging tonen');
assert.ok(js.includes('function returnToHome()'),'Terugknop moet terug naar het startscherm navigeren');
assert.ok(js.includes("makeButton('← Terug naar start'"),'Elke functie moet een duidelijke terugknop hebben');

assert.ok(js.includes("$$('.feature').forEach(s=>s.hidden=true)"),'Terugknop moet alle functievakken verbergen');
assert.ok(js.includes("$$('.feature').forEach(section=>"),'Elke functie moet een terugknop krijgen');
assert.ok(js.includes("if(!section)return;$$('.feature').forEach(s=>s.hidden=true)"),'Dashboardnavigatie moet alle andere functievakken sluiten');
assert.ok(js.includes("if(section.classList.contains('feature'))section.hidden=false"),'Alleen functievakken die bij een tegel horen mogen als scherm openen');
assert.ok(js.includes("data.appointments.find(a=>a.date===date&&a.time===time)"),'Dubbele afspraken op hetzelfde tijdstip moeten worden tegengehouden');
assert.ok(js.includes("if(!title){status.textContent='Vul eerst een naam in voor je afspraak.';$('#appointment-title').focus();return;}if(!date||!time){status.textContent='Vul de datum en tijd van je afspraak in.';return;}"),'Ontbrekende afspraakgegevens moeten duidelijke uitleg geven');
assert.ok(js.includes("$('#appointment-date').min=todayISO"),'Datumkiezer moet afspraken in het verleden blokkeren');
assert.ok(js.includes("if(date<todayISO){status.textContent='Kies vandaag of een datum in de toekomst voor deze afspraak.';return;}"),'Handmatige invoer van een datum in het verleden moet worden tegengehouden');
assert.ok(js.includes("if(date===todayISO&&time<currentTime){status.textContent='Dit tijdstip is vandaag al voorbij. Kies een latere tijd.';return;}"),'Een verstreken tijdstip vandaag moet worden tegengehouden');
assert.ok(js.includes("if(!persist()){data.appointments.pop();renderAppointments();")&&js.includes("status.textContent='Afspraak opgeslagen op dit apparaat: '+title"),'Nieuwe afspraak moet alleen succesvolle opslag bevestigen');
assert.ok(js.includes("$('#appointment-title').value='';$('#appointment-title').focus();"),'Na opslaan van een afspraak moet de naam invoer klaarstaan voor de volgende afspraak');
assert.ok(js.includes("'Afspraak verwijderd: '+item.title"),'Verwijderen van afspraak moet een bevestiging tonen');
assert.ok(js.includes("data.tasks.push({text,done:false})"),'Nieuwe taken moeten kunnen worden toegevoegd');
assert.ok(js.includes("if(!text){$('#task-status').textContent='Vul eerst in wat je wilt doen.';$('#task').focus();return;}"),'Lege taak moet een duidelijke uitleg geven en de invoer focussen');
assert.ok(js.includes("$('#task').value='';$('#task').focus();"),'Na het toevoegen van een taak moet de invoer klaarstaan voor de volgende taak');
assert.ok(js.includes('Je hebt nog geen taken. Voeg hierboven je eerste taak toe.'),'Lege takenlijst moet uitleg tonen');
assert.ok(js.includes('Je hebt nog geen afspraken. Voeg hierboven een afspraak toe.'),'Lege afsprakenlijst moet uitleg tonen');
assert.ok(js.includes("data.fontScale=Math.max(.85"),'Tekstgrootte moet een ondergrens hebben');
assert.ok(js.includes('Math.min(1.5,Math.round('),'Tekstgrootte moet een bovengrens hebben');
assert.ok(js.includes("window.SpeechRecognition||window.webkitSpeechRecognition"),'Spraakherkenning moet op ondersteunde browsers werken');
assert.ok(html.includes('id="speech-status" aria-live="polite"'),'Communicatie moet een toegankelijke statusmelding hebben');
assert.ok(html.includes('<button id="clear-diary" class="secondary" type="button">Dagboek wissen</button>'),'Dagboek moet een duidelijke wisknop hebben');
assert.ok(js.includes("$('#clear-diary').addEventListener('click'")&&js.includes("data.diary='';if(!persist()){data.diary=previousDiary;")&&js.includes("$('#diary').value='';$('#diary-status').textContent='Je dagboektekst is gewist van dit apparaat.'"),'Dagboek wissen moet ook de opgeslagen tekst verwijderen');
assert.ok(js.includes("function persist(){try{localStorage.setItem(key,JSON.stringify(data));return true;}catch")&&js.includes("if(persist()){$('#diary-status').textContent='Je dagboek is opgeslagen op dit apparaat.';}else{$('#diary-status').textContent='Je dagboek kon niet worden opgeslagen."),'Dagboek moet alleen melden dat het is opgeslagen als lokaal opslaan lukt');
assert.ok(js.includes("window.confirm('Weet je zeker dat je je dagboektekst wilt wissen? Dit kan niet ongedaan worden gemaakt.')")&&js.includes("Je dagboek is niet gewist."),'Dagboek wissen moet eerst om bevestiging vragen en annuleren respecteren');
assert.ok(html.includes('<label for="say-text">Wat wil je zeggen?</label>'),'Communicatie-invoer moet een zichtbaar label hebben');
for(const id of ['speak','clear-speech','clear-drawing','download-drawing','export-data','delete-data']) assert.ok(html.includes(`id="${id}"`) && new RegExp(`<button\\b(?=[^>]*\\bid="${id}")(?=[^>]*\\btype="button")`).test(html),`Actieknop ${id} moet type=button hebben`);
for(const phrase of ['Ik heb even rust nodig.','Kun je mij helpen?','Ik begrijp het niet.']) assert.ok(html.includes(`<button type="button" data-phrase="${phrase}">`),`Communicatiezin ${phrase} mag geen formulier verzenden`);
assert.ok(html.includes('id="goals-status" aria-live="polite"'),'Kleine stapjes moeten een toegankelijke voortgangsmelding hebben');
assert.ok(html.includes('<progress id="goals-progress" max="3" value="0">'),'Kleine stapjes moeten een visuele voortgangsbalk hebben');
assert.ok(js.includes("progress.value=checked"),'Voortgangsbalk moet meebewegen met afgevinkte stapjes');
assert.ok(js.includes('function updateGoalsStatus()'),'Voortgang van kleine stapjes moet worden bijgewerkt');
assert.ok(js.includes("$('.checklist input[type=checkbox]').forEach(cb=>cb.checked=false);updateGoalsStatus();renderTasks();"),'Voortgangsbalk moet na het verwijderen van gegevens worden teruggezet');
assert.ok(js.includes('Goed bezig! Je hebt ${checked} van de ${total} stapjes afgevinkt.'),'Voortgang moet tonen hoeveel stapjes zijn afgevinkt');
assert.ok(js.includes("status.textContent='Voorlezen is klaar.'"),'Voorlezen moet een eindmelding geven');
assert.ok(js.includes("$('#speech-status').textContent='De tekst is gewist.'"),'Wissen moet een statusmelding geven');
assert.ok(html.includes('Gratis voor iedereen')&&html.includes('Geen begeleidersportaal'),'App moet gratis zijn en geen begeleidersportaal tonen');
for (const target of [...html.matchAll(/data-target="([^"]+)"/g)].map(m=>m[1])) {
  assert.ok(ids.includes(target), `Dashboardknop verwijst naar ontbrekend onderdeel: #${target}`);
}
assert.ok(html.includes('data-target="gevoelens"') && html.includes('id="gevoelens"'),'Gevoelensknop moet naar het gevoelensgedeelte gaan');
const css=readFileSync('styles.css','utf8');
for (const selector of ['.hero-inner','.tile-icon','.footer-points','.tile-purple','.tile-pink','@media(max-width:520px)']) assert.ok(css.includes(selector), `Vormgeving mist responsive onderdeel: ${selector}`);

const sw=readFileSync('sw.js','utf8');
assert.ok(sw.includes("self.skipWaiting()"),'Nieuwe serviceworker moet direct kunnen activeren');
assert.ok(sw.includes("self.clients.claim()"),'Nieuwe serviceworker moet bestaande pagina’s overnemen');
assert.ok(sw.includes("fetch(request)"),'Online bestanden moeten eerst vernieuwd worden');
assert.ok(sw.includes("caches.match(request)"),'Offline bestanden moeten uit de cache beschikbaar blijven');
assert.ok(sw.includes("request.mode === 'navigate'"),'Offline navigatie moet naar de startpagina kunnen terugvallen');
assert.ok(js.includes("data.drawing=canvas.toDataURL('image/png')"),'Tekeningen moeten lokaal worden bewaard');
assert.ok(js.includes('savedDrawing.src=data.drawing'),'Opgeslagen tekening moet bij opnieuw openen worden teruggezet');
assert.ok(js.includes("$('#diary').value='';$('#say-text').value='';if('speechSynthesis'in window)speechSynthesis.cancel();$('#speech-status').textContent='';$('#dictation-status').textContent='';ctx.clearRect(0,0,canvas.width,canvas.height);"),'Alle gegevens verwijderen moet ook dagboek, communicatie-invoer en lopend voorlezen wissen');
assert.ok(js.includes("b.setAttribute('aria-pressed',String(b.dataset.mood===data.mood))"),'Gekozen gevoel moet met aria-pressed toegankelijk worden aangegeven');
assert.ok(js.includes('const previousMood=data.mood;data.mood=b.dataset.mood;if(!persist()){data.mood=previousMood;showMood();'),'Gevoel moet bij opslagfout worden teruggedraaid');
const cssForMood=readFileSync('styles.css','utf8');
assert.ok(cssForMood.includes('.mood[aria-pressed="true"]'),'Gekozen gevoel moet visueel herkenbaar zijn');
assert.ok(css.includes('select:focus-visible')&&css.includes('input[type=checkbox]:focus-visible')&&css.includes('a:focus-visible'),'Selectievakken, checkboxes en links moeten zichtbare toetsenbordfocus hebben');
assert.ok(css.includes('progress::-webkit-progress-value')&&css.includes('progress::-moz-progress-bar'),'Voortgangsbalk moet op gangbare browsers duidelijk zichtbaar zijn');
assert.ok(css.includes('.high-contrast progress::-webkit-progress-value')&&css.includes('.high-contrast progress::-moz-progress-bar'),'Voortgangsbalk moet ook in hoog contrast duidelijk zichtbaar zijn');
assert.ok(css.includes('.high-contrast button{background:#000!important;color:#fff!important;')&&css.includes('.high-contrast button.secondary{background:#fff!important;color:#000!important;'),'Knoppen moeten in hoog contrast duidelijke tekst en achtergrond hebben');
assert.ok(css.includes('.high-contrast button:focus-visible')&&css.includes('outline:4px solid #000'),'Toetsenbordfocus moet in hoog contrast extra duidelijk zijn');
console.log('MijnMoment smoke-tests: alles geslaagd.');

assert.ok(js.includes('const previousGoal=data.goals[i];data.goals[i]=cb.checked;if(!persist()){data.goals[i]=previousGoal;cb.checked=previousGoal;updateGoalsStatus();'),'Stapjes moeten bij opslagfout worden teruggedraaid');
assert.ok(js.includes('data.fontScale=previousScale;applyDisplaySettings();'),'Tekstgrootte moet bij opslagfout worden hersteld');
assert.ok(js.includes('data.highContrast=previousContrast;applyDisplaySettings();'),'Contrast moet bij opslagfout worden hersteld');
assert.ok(js.includes("if(!persist()){data.drawing=previousDrawing;")&&js.includes('De vorige opgeslagen tekening is behouden.'),'Tekening moet vorige opgeslagen versie behouden bij opslagfouten');
assert.ok(js.includes("Wissen niet opgeslagen. De vorige opgeslagen tekening is behouden."),'Tekening wissen moet een mislukte opslag melden');

assert.ok(js.includes("$('#import-data').addEventListener('click',()=>$('#import-file').click())"),'Back-up terugzetten moet een bestand kunnen kiezen');
assert.ok(js.includes("file.size>5*1024*1024"),'Import moet extreem grote back-upbestanden afwijzen');
assert.ok(js.includes('Deze back-up is ongeldig of niet van MijnMoment. Je gegevens zijn niet gewijzigd.'),'Ongeldige back-ups mogen bestaande gegevens niet wijzigen');
assert.ok(js.includes('Een back-up terugzetten vervangt de huidige gegevens op dit apparaat.'),'Terugzetten moet vooraf waarschuwen voor vervangen van gegevens');
assert.ok(js.includes("if(!persist()){data=previous;$('#settings-status').textContent='Terugzetten is niet gelukt. Je huidige gegevens zijn behouden.';return;}"),'Bij opslagfout moet import de huidige gegevens herstellen');

assert.ok(js.includes("incoming.appointments.length<=1000"),'Back-upimport moet het aantal afspraken begrenzen');
assert.ok(js.includes("new Set(incoming.appointments.map(x=>x&&x.id)).size===incoming.appointments.length"),'Back-upimport moet dubbele afspraak-ID’s afwijzen');
assert.ok(js.includes("typeof x.id==='string'&&x.id.length>0&&typeof x.title==='string'&&x.title.trim().length>0"),'Back-upimport moet afspraken met ontbrekende ID of lege naam afwijzen');
assert.ok(js.includes("incoming.tasks.length<=1000&&incoming.tasks.every(x=>x&&typeof x.text==='string'&&x.text.length<=120&&typeof x.done==='boolean')"),'Back-upimport moet het aantal taken en de lengte van taaknamen begrenzen');
assert.ok(js.includes("d.toISOString().slice(0,10)===x.date"),'Back-upimport moet onmogelijke kalenderdatums afwijzen');
assert.ok(js.includes("['','Groen','Oranje','Rood'].includes(incoming.mood)"),'Back-upimport moet alleen bekende gevoelswaarden accepteren');
assert.ok(js.includes("incoming.diary.length<=100000"),'Back-upimport moet onredelijk lange dagboekteksten afwijzen');
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
assert.ok(js.includes(datePattern.toString()),'Back-upimport moet het juiste datumpatroon gebruiken');
assert.ok(js.includes(timePattern.toString()),'Back-upimport moet het juiste tijdpatroon gebruiken');
assert.ok(datePattern.test('2026-10-24')&&!datePattern.test('2026-1-24'),'Datumpatroon moet ISO-notatie eisen');
assert.ok(timePattern.test('09:30')&&timePattern.test('23:59')&&!timePattern.test('24:00')&&!timePattern.test('9:30'),'Tijdpatroon moet geldige 24-uurs tijden herkennen');

assert.ok(js.includes('renderTasks();renderAppointments();showMood();applyDisplaySettings();updateGoalsStatus();'),'Na terugzetten van een back-up moet de doelenvoortgang meteen worden bijgewerkt');

assert.ok(js.includes('if(data.drawing===savedDrawing.src)ctx.drawImage(savedDrawing,0,0,canvas.width,canvas.height)'), 'Een verouderde tekening mag niet na het laden opnieuw verschijnen');
assert.ok(js.includes('if(data.drawing===restored.src)ctx.drawImage(restored,0,0,canvas.width,canvas.height)'), 'Alleen de laatst teruggezette tekening mag op het canvas verschijnen');

assert.ok(js.includes("const previousDiary=data.diary;data.diary='';if(!persist()){data.diary=previousDiary;"),'Dagboek wissen moet opgeslagen tekst herstellen wanneer opslaan mislukt');
assert.ok(js.includes('Wissen is niet gelukt. Je opgeslagen dagboektekst is behouden.'),'Dagboek wissen moet een opslagfout duidelijk melden');

assert.ok(js.includes("if(!persist()){data.tasks.splice(i,0,removed);"),'Een verwijderde taak moet worden hersteld als opslaan mislukt');
assert.ok(js.includes('Verwijderen is niet gelukt. De taak is behouden.'),'Bij een mislukte taakverwijdering moet de gebruiker een duidelijke melding krijgen');

assert.ok(js.includes('const previousAppointments=data.appointments;data.appointments=data.appointments.filter(a=>a.id!==item.id);if(!persist()){data.appointments=previousAppointments;'),'Bij opslagfout moet een verwijderde afspraak terugkomen');
assert.ok(js.includes('Verwijderen is niet gelukt. De afspraak is behouden.'),'Bij mislukte afspraakverwijdering moet een duidelijke foutmelding verschijnen');

assert.ok(js.includes("if(!persist()){data.tasks.pop();renderTasks();"),'Mislukte taaktoevoeging mag geen niet-opgeslagen taak laten staan');
assert.ok(js.includes('Taak niet opgeslagen. Je tekst blijft staan.'),'Bij mislukte taaktoevoeging moet invoer behouden blijven');
assert.ok(js.includes("if(!persist()){data.appointments.pop();renderAppointments();"),'Mislukte afspraaktoevoeging mag geen niet-opgeslagen afspraak laten staan');
assert.ok(js.includes('Afspraak niet opgeslagen. Je gegevens blijven staan.'),'Bij mislukte afspraaktoevoeging moet invoer behouden blijven');

assert.ok(js.includes('const previousDone=data.tasks[i].done;data.tasks[i].done=cb.checked;if(!persist()){data.tasks[i].done=previousDone;'),'Afvinken moet bij opslagfout de vorige status herstellen');
assert.ok(js.includes('Afvinken is niet opgeslagen. De vorige status is behouden.'),'Mislukt afvinken moet duidelijk worden gemeld');

assert.ok(js.includes('Je gevoel kon niet worden opgeslagen. De vorige keuze is behouden.'),'Gevoel moet een duidelijke foutmelding tonen');
assert.ok(js.includes('Je stapje kon niet worden opgeslagen. De vorige stand is behouden.'),'Doelen moeten een duidelijke foutmelding tonen');

assert.ok(js.includes('Tekstgrootte niet opgeslagen. De vorige instelling is behouden.'),'Tekstgrootte moet een duidelijke foutmelding tonen');
assert.ok(js.includes('Contrast niet opgeslagen. De vorige instelling is behouden.'),'Contrast moet een duidelijke foutmelding tonen');

assert.ok(js.includes('incoming.drawing.length<=4*1024*1024'),'Back-uptekeningen moeten een maximale grootte hebben');
assert.ok(js.includes('(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?'),'Back-uptekeningen moeten geldige base64-notatie gebruiken');

for(const asset of ['./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/mijnmoment-icon.svg']) assert.ok(sw.includes("'"+asset+"'"),`Offline cache mist ${asset}`);
assert.ok(sw.includes('event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)).catch(() => {}))'),'Cachefouten mogen het laden van de app niet verstoren');
assert.ok(sw.includes("caches.match(request, { ignoreSearch: request.mode === 'navigate' })"),'Offline navigatie met queryparameters moet de cache kunnen gebruiken');
assert.ok(sw.includes("if (request.mode === 'navigate')")&&sw.includes("caches.match('./index.html')"),'Offline navigatie moet terugvallen op de startpagina');


assert.ok(css.includes('button{min-height:44px}'),'Knoppen moeten voldoende groot zijn om aan te raken');
assert.ok(css.includes(':focus-visible{outline:3px solid #a85200;outline-offset:4px}'),'Toetsenbordfocus moet duidelijk zichtbaar zijn');
assert.ok(css.includes('.high-contrast :focus-visible{outline:4px solid #e69b00!important'),'Toetsenbordfocus moet ook in hoog contrast zichtbaar zijn');

assert.ok(js.includes("$$('[data-target]').forEach("),'Alle starttegels moeten een klikactie krijgen');
assert.ok(js.includes("$$('[data-phrase]').forEach("),'Alle communicatiezinnen moeten een klikactie krijgen');

assert.equal([...js.matchAll(/(?<!\$)\$\([^\n)]*\)\.forEach/g)].length,0,'Gebruik querySelectorAll voor collecties; querySelector veroorzaakt een opstartfout');

assert.ok(js.includes('function showScreen(target,updateHistory=true)'),'Elk onderdeel moet een eigen scherm krijgen');
assert.ok(js.includes("window.addEventListener('popstate'"),'Android-terug moet navigeren tussen schermen');
assert.ok(js.includes("feelingsBack.classList.add('back-home')"),'Ook Gevoelens moet een terugknop hebben');
assert.ok(readFileSync('styles.css','utf8').includes('[hidden]{display:none!important}'),'Verborgen schermen mogen niet zichtbaar zijn');

assert.ok(js.includes("document.title=home?'MijnMoment'"),'Schermtitel moet meeveranderen met het gekozen onderdeel');
assert.ok(js.includes("heading.focus({preventScroll:true})"),'Nieuw scherm moet focus geven aan de kop voor toegankelijkheid');

assert.ok(js.includes('localStorage.getItem(key)!==serialized'),'Na opslaan moet MijnMoment de gegevens direct kunnen teruglezen');

assert.ok(js.includes('await nativeStorage.get({key})'),'Android-opslag moet worden gelezen vóór het tonen van gegevens');
assert.ok(js.includes('nativeStorage.set({key,value})'),'Wijzigingen moeten ook in Android-opslag worden bewaard');
assert.ok(js.includes('nativeStorage.remove({key})'),'Gegevens verwijderen moet ook Android-opslag wissen');
assert.ok(JSON.parse(readFileSync('package.json','utf8')).dependencies['@capacitor/preferences'],'Native opslagplugin moet beschikbaar zijn');

assert.ok(js.includes("total=$('.checklist input[type=checkbox]').length"),'Voortgangsbalk moet alle checkboxes tellen, niet één element');
assert.ok(!js.includes("total=$('.checklist input[type=checkbox]').length"),'Voortgangsbalk mag geen enkel element tellen');
