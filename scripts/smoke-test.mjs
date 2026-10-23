import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
for (const file of ['index.html','styles.css','app.js','manifest.webmanifest','sw.js','assets/mijnmoment-icon.svg']) assert.ok(existsSync(file),`Bestand ontbreekt: ${file}`);
const html=readFileSync('index.html','utf8');
for (const feature of ['MijnMoment','planning','afspraken','communicatie','dagboek','tekenen','doelen','instellingen','dictate-diary','font-larger','contrast-toggle']) assert.ok(html.includes(feature),`HTML mist functie: ${feature}`);
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
console.log('MijnMoment smoke-tests: alles geslaagd.');

assert.ok(js.includes('function returnToHome()'),'Terugknop moet terug naar het startscherm navigeren');
assert.ok(js.includes("makeButton('← Terug naar start'"),'Elke functie moet een duidelijke terugknop hebben');

assert.ok(js.includes("$$('.feature').forEach(s=>s.hidden=true)"),'Terugknop moet alle functievakken verbergen');
assert.ok(js.includes("$$('.feature').forEach(section=>"),'Elke functie moet een terugknop krijgen');
assert.ok(js.includes("$$( '.feature' ).forEach(s=>s.hidden=s!==section)".replaceAll(" ", "")),'Navigatie moet precies één functievak tonen');
assert.ok(js.includes("data.appointments.find(a=>a.date===date&&a.time===time)"),'Dubbele afspraken op hetzelfde tijdstip moeten worden tegengehouden');
assert.ok(js.includes("data.tasks.push({text,done:false})"),'Nieuwe taken moeten kunnen worden toegevoegd');
assert.ok(js.includes("data.fontScale=Math.max(.85"),'Tekstgrootte moet een ondergrens hebben');
assert.ok(js.includes("data.fontScale=Math.min(1.5"),'Tekstgrootte moet een bovengrens hebben');
assert.ok(js.includes("window.SpeechRecognition||window.webkitSpeechRecognition"),'Spraakherkenning moet op ondersteunde browsers werken');
assert.ok(html.includes('Gratis voor iedereen')&&html.includes('Geen begeleidersportaal'),'App moet gratis zijn en geen begeleidersportaal tonen');
