import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const file of ['index.html','styles.css','app.js','manifest.webmanifest','sw.js','assets/mijnmoment-icon.svg']) assert.ok(existsSync(file),`Bestand ontbreekt: ${file}`);
const html=readFileSync('index.html','utf8');
for (const feature of ['MijnMoment','planning','afspraken','communicatie','dagboek','tekenen','doelen','instellingen','gevoelens','section-intro','tile-icon','site-footer','dictate-diary','font-larger','contrast-toggle']) assert.ok(html.includes(feature),`HTML mist functie: ${feature}`);
const js=readFileSync('app.js','utf8');
for (const feature of ['localStorage','appointment-form','appointment-list','conflict','speechSynthesis','download-drawing','SpeechRecognition','highContrast','fontScale']) assert.ok(js.includes(feature),`JavaScript mist functie of controle: ${feature}`);
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
assert.ok(js.includes('function returnToHome()'),'Terugknop moet terug naar het startscherm navigeren');
assert.ok(js.includes("makeButton('← Terug naar start'"),'Elke functie moet een duidelijke terugknop hebben');

assert.ok(js.includes("$$('.feature').forEach(s=>s.hidden=true)"),'Terugknop moet alle functievakken verbergen');
assert.ok(js.includes("$$('.feature').forEach(section=>"),'Elke functie moet een terugknop krijgen');
assert.ok(js.includes("if(!section)return;$$('.feature').forEach(s=>s.hidden=true)"),'Dashboardnavigatie moet alle andere functievakken sluiten');
assert.ok(js.includes("if(section.classList.contains('feature'))section.hidden=false"),'Alleen functievakken die bij een tegel horen mogen als scherm openen');
assert.ok(js.includes("data.appointments.find(a=>a.date===date&&a.time===time)"),'Dubbele afspraken op hetzelfde tijdstip moeten worden tegengehouden');
assert.ok(js.includes("data.tasks.push({text,done:false})"),'Nieuwe taken moeten kunnen worden toegevoegd');
assert.ok(js.includes("data.fontScale=Math.max(.85"),'Tekstgrootte moet een ondergrens hebben');
assert.ok(js.includes("data.fontScale=Math.min(1.5"),'Tekstgrootte moet een bovengrens hebben');
assert.ok(js.includes("window.SpeechRecognition||window.webkitSpeechRecognition"),'Spraakherkenning moet op ondersteunde browsers werken');
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
console.log('MijnMoment smoke-tests: alles geslaagd.');
