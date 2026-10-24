(async()=>{
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const key='mijnmoment-data-v2';
const defaults={tasks:[],appointments:[],mood:'',diary:'',drawing:'',goals:[false,false,false],fontScale:1,highContrast:false};
let data={...defaults};
const nativeStorage=window.Capacitor?.isNativePlatform?.()?window.Capacitor.Plugins?.Preferences:null;
const storageDiagnostic=()=>`Opslag: ${nativeStorage?'Android beschikbaar':'Android niet beschikbaar'} · Capacitor: ${window.Capacitor?'ja':'nee'} · Platform: ${window.Capacitor?.getPlatform?.()||'onbekend'}`;

$('#storage-diagnostic').textContent=storageDiagnostic()+' · Start: bezig';
let savedText='';
try{savedText=localStorage.getItem(key)||localStorage.getItem('mijnmoment-data-v1')||'';}catch{}
if(nativeStorage){
  try{const result=await nativeStorage.get({key});if(result.value!==null)savedText=result.value;}catch{ /* Blijf bestaande browsergegevens gebruiken. */ }
}
try{data={...defaults,...JSON.parse(savedText||'{}')};}catch{}
let saveSequence=0;
function saveNative(value){
  if(!nativeStorage)return;
  const sequence=++saveSequence;
  $('#storage-diagnostic').textContent=storageDiagnostic()+' · Opslaan: bezig';
  nativeStorage.set({key,value}).then(()=>nativeStorage.get({key})).then(result=>{
    if(result.value!==value)throw new Error('Controle na opslaan mislukt');
    if(sequence===saveSequence)$('#storage-diagnostic').textContent=storageDiagnostic()+' · Opslaan: gelukt';
  }).catch(()=>{
    if(sequence===saveSequence)$('#storage-diagnostic').textContent=storageDiagnostic()+' · Opslaan: mislukt';
    $('#settings-status').textContent='Android-opslag is niet gelukt. Maak een back-up van je gegevens.';
  });
}
if(!Array.isArray(data.tasks))data.tasks=[];
if(!Array.isArray(data.appointments))data.appointments=[];
if(!Array.isArray(data.goals))data.goals=[false,false,false];
if(!Number.isFinite(Number(data.fontScale)))data.fontScale=1;data.fontScale=Math.max(.85,Math.min(1.5,Number(data.fontScale)));if(typeof data.highContrast!=='boolean')data.highContrast=false;
function persist(){try{const serialized=JSON.stringify(data);localStorage.setItem(key,serialized);if(localStorage.getItem(key)!==serialized)throw new Error('Opslagcontrole mislukt');saveNative(serialized);return true;}catch{$('#settings-status').textContent='Opslaan lukt niet. Controleer de vrije ruimte en app-opslag op je apparaat.';return false;}}
function makeButton(text,cls,action){const b=document.createElement('button');b.type='button';b.textContent=text;b.className=cls||'';b.addEventListener('click',action);return b;}
function localDateISO(offset=0){const d=new Date();d.setDate(d.getDate()+offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
$('#task-today').addEventListener('click',()=>{$('#task-date').value=localDateISO();});
$('#task-tomorrow').addEventListener('click',()=>{$('#task-date').value=localDateISO(1);});
function taskDateLabel(date){if(!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date||''))return '';if(date===localDateISO())return 'Vandaag';if(date===localDateISO(1))return 'Morgen';const d=new Date(date+'T12:00:00');return Number.isNaN(d.getTime())?'':d.toLocaleDateString('nl-NL',{day:'numeric',month:'long',year:'numeric'});}
let taskFilter='today';
$('#new-day-button').addEventListener('click',()=>{
  taskFilter='today';
  $('#task-date').value=localDateISO();
  renderTasks();
  const message=$('#new-day-message');
  message.textContent='Vandaag is een nieuwe dag. Je mag rustig opnieuw beginnen. 💚 Je oude taken blijven bewaard.';
  message.hidden=false;
});
$('#today-home-button').addEventListener('click',()=>{taskFilter='today';renderTasks();showScreen('planning');});
for(const [id,filter] of [['tasks-today','today'],['tasks-tomorrow','tomorrow'],['tasks-done','done'],['tasks-all','all'],['tasks-open','open']]){
  $('#'+id).addEventListener('click',()=>{taskFilter=filter;renderTasks();});
}
function updateTodayReminder(){
  const todayTasks=data.tasks.filter(task=>task.date===localDateISO());
  const remaining=todayTasks.filter(task=>!task.done).length;
  $('#today-finished').hidden=!(todayTasks.length>0&&remaining===0);
  const hour=new Date().getHours();
  $('#today-reminder-title').textContent=(hour<12?'☀️ Goedemorgen!':hour<18?'🌤️ Goedemiddag!':'🌙 Goedenavond!');
  $('#today-reminder-message').textContent=remaining===0?'Je hebt geen openstaande taken voor vandaag. Neem rustig je moment. 💚':remaining===1?'Je hebt vandaag nog 1 taak. Neem rustig de tijd. 💚':'Je hebt vandaag nog '+remaining+' taken. Je hoeft niet alles tegelijk te doen. 💚';
}
const openWeekDays=new Set([localDateISO()]);
function setAllWeekDays(shouldOpen){
  openWeekDays.clear();
  for(let offset=0;offset<7;offset++)if(shouldOpen)openWeekDays.add(localDateISO(offset));
  renderWeek();
}
$('#week-open-all').addEventListener('click',()=>setAllWeekDays(true));
$('#week-close-all').addEventListener('click',()=>setAllWeekDays(false));
function renderWeek(){
  const container=$('#week-days');container.replaceChildren();
  for(let offset=0;offset<7;offset++){
    const date=localDateISO(offset);
    const dayTasks=data.tasks.filter(task=>task.date===date);
    const open=dayTasks.filter(task=>!task.done).length;
    const day=new Date(date+'T12:00:00');
    const title=offset===0?'Vandaag':offset===1?'Morgen':day.toLocaleDateString('nl-NL',{weekday:'long'});
    const card=document.createElement('details');card.className='week-day';card.open=openWeekDays.has(date);
    card.addEventListener('toggle',()=>{if(card.open)openWeekDays.add(date);else openWeekDays.delete(date);});
    const dayHeader=document.createElement('summary');dayHeader.className='week-day-header';
    const heading=document.createElement('strong');heading.textContent=title+' · '+day.toLocaleDateString('nl-NL',{day:'numeric',month:'long'});
    const count=document.createElement('span');count.textContent=dayTasks.length===0?'Geen taken':open+' nog te doen · '+(dayTasks.length-open)+' afgerond';
    dayHeader.append(heading,count);card.append(dayHeader);
    const dayContent=document.createElement('div');dayContent.className='week-day-content';
    if(dayTasks.length){const list=document.createElement('ul');for(const task of dayTasks){
      const item=document.createElement('li');
      const taskText=document.createElement('span');taskText.textContent=(task.done?'✓ ':'○ ')+task.text;
      const editButton=makeButton('✏️ Taak aanpassen','secondary',()=>{
        const form=document.createElement('form');form.className='task-edit-form';
        const nameLabel=document.createElement('label');nameLabel.textContent='Naam van de taak';
        const nameInput=document.createElement('input');nameInput.type='text';nameInput.maxLength=120;nameInput.required=true;nameInput.value=task.text;nameLabel.append(nameInput);
        const dateLabel=document.createElement('label');dateLabel.textContent='Datum (mag leeg blijven)';
        const dateInput=document.createElement('input');dateInput.type='date';dateInput.value=task.date||'';dateLabel.append(dateInput);
        const buttons=document.createElement('div');buttons.className='form-row';
        const saveButton=document.createElement('button');saveButton.type='submit';saveButton.textContent='Opslaan';
        const cancelButton=makeButton('Annuleren','secondary',()=>renderTasks());
        buttons.append(saveButton,cancelButton);form.append(nameLabel,dateLabel,buttons);
        form.addEventListener('submit',event=>{event.preventDefault();const newText=nameInput.value.trim();if(!newText){nameInput.focus();return;}const previous={text:task.text,date:task.date};task.text=newText;task.date=dateInput.value;if(!persist()){task.text=previous.text;task.date=previous.date;$('#task-status').textContent='Aanpassen is niet opgeslagen. De oude taak is behouden.';renderTasks();return;}$('#task-status').textContent='Taak aangepast en opgeslagen: '+newText;renderTasks();});
        item.replaceChildren(form);nameInput.focus();
      });
      const toggleButton=makeButton(task.done?'↩️ Opnieuw doen':'✅ Taak afvinken','secondary',()=>{
        const previousDone=task.done;
        task.done=!previousDone;
        if(!persist()){
          task.done=previousDone;
          $('#task-status').textContent='Wijziging niet opgeslagen. De vorige taakstatus is behouden.';
          renderTasks();return;
        }
        $('#task-status').textContent=task.done?'Taak afgevinkt: '+task.text:'Taak opnieuw geopend: '+task.text;
        renderTasks();
      });
      toggleButton.classList.add('week-toggle-task');
      const deleteButton=makeButton('🗑️ Taak verwijderen','secondary',()=>{
        const confirmation=document.createElement('div');confirmation.className='task-delete-confirmation';
        const question=document.createElement('p');question.textContent='Wil je deze taak echt verwijderen? '+task.text;
        const actions=document.createElement('div');actions.className='form-row';
        const yes=makeButton('Ja, verwijderen','secondary',()=>{
          const index=data.tasks.indexOf(task);
          if(index<0){renderTasks();return;}
          const removed=data.tasks.splice(index,1)[0];
          if(!persist()){
            data.tasks.splice(index,0,removed);
            $('#task-status').textContent='Verwijderen is niet gelukt. De taak is behouden.';
            renderTasks();return;
          }
          $('#task-status').textContent='Taak verwijderd: '+removed.text;
          renderTasks();
        });
        const no=makeButton('Nee, bewaren','secondary',()=>{renderTasks();$('#task-status').textContent='Taak bewaard: '+task.text;});
        actions.append(yes,no);confirmation.append(question,actions);item.replaceChildren(confirmation);no.focus();
      });
      deleteButton.classList.add('week-delete-task');
      editButton.classList.add('week-edit-task');item.append(taskText,toggleButton,editButton,deleteButton);list.append(item);
    }dayContent.append(list);}
    const addButton=makeButton('➕ Taak toevoegen aan '+title.toLowerCase(),'secondary',()=>{
      $('#task-date').value=date;
      $('#task').focus();
      $('#task').scrollIntoView({block:'center',behavior:'smooth'});
    });
    addButton.classList.add('week-add-task');
    dayContent.append(addButton);card.append(dayContent);
    container.append(card);
  }
}
function renderTasks(){renderWeek();updateTodayReminder();const ul=$('#task-list');ul.replaceChildren();const openCount=data.tasks.filter(task=>!task.done).length;const doneCount=data.tasks.length-openCount;const percent=data.tasks.length?Math.round(doneCount/data.tasks.length*100):0;$('#task-done-count').textContent=String(doneCount);$('#task-open-count').textContent=String(openCount);$('#task-progress-percent').textContent=percent+'%';$('#task-progress-bar').value=percent;$('#task-progress-bar').textContent=percent+'%';$('#task-summary').textContent=`${openCount} nog te doen · ${data.tasks.length-openCount} afgerond`;for(const [id,filter] of [['tasks-today','today'],['tasks-tomorrow','tomorrow'],['tasks-done','done'],['tasks-all','all'],['tasks-open','open']])$('#'+id).setAttribute('aria-pressed',String(taskFilter===filter));if(data.tasks.length===0){const empty=document.createElement('li');empty.className='empty-state';empty.textContent='Je hebt nog geen taken. Voeg hierboven je eerste taak toe.';ul.append(empty);return;}data.tasks.forEach((task,i)=>{if(taskFilter==='open'&&task.done||taskFilter==='done'&&!task.done||taskFilter==='today'&&(task.done||task.date!==localDateISO())||taskFilter==='tomorrow'&&(task.done||task.date!==localDateISO(1)))return;const li=document.createElement('li');const label=document.createElement('label');const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!task.done;cb.addEventListener('change',()=>{const previousDone=data.tasks[i].done;data.tasks[i].done=cb.checked;if(!persist()){data.tasks[i].done=previousDone;$('#task-status').textContent='Afvinken is niet opgeslagen. De vorige status is behouden.';renderTasks();return;}$('#task-status').textContent=cb.checked?'Taak afgevinkt: '+data.tasks[i].text:'Taak weer open: '+data.tasks[i].text;renderTasks();});label.append(cb,document.createTextNode(' '+task.text+(taskDateLabel(task.date)?' — '+taskDateLabel(task.date):'')));if(task.done)label.style.textDecoration='line-through';li.append(label);if(task.done)li.append(makeButton('Opnieuw doen','secondary',()=>{
  task.done=false;
  if(!persist()){task.done=true;$('#task-status').textContent='Opnieuw doen is niet opgeslagen. De taak blijft afgerond.';renderTasks();return;}
  $('#task-status').textContent='Taak staat weer bij Nog te doen: '+task.text;
  renderTasks();
}));li.append(makeButton('Aanpassen','secondary',()=>{
  const form=document.createElement('form');form.className='task-edit-form';
  const nameLabel=document.createElement('label');nameLabel.textContent='Naam van de taak';
  const nameInput=document.createElement('input');nameInput.type='text';nameInput.maxLength=120;nameInput.required=true;nameInput.value=task.text;nameLabel.append(nameInput);
  const dateLabel=document.createElement('label');dateLabel.textContent='Datum (mag leeg blijven)';
  const dateInput=document.createElement('input');dateInput.type='date';dateInput.value=task.date||'';dateLabel.append(dateInput);
  const buttons=document.createElement('div');buttons.className='form-row';
  const saveButton=document.createElement('button');saveButton.type='submit';saveButton.textContent='Opslaan';
  const cancelButton=makeButton('Annuleren','secondary',()=>renderTasks());
  buttons.append(saveButton,cancelButton);form.append(nameLabel,dateLabel,buttons);
  form.addEventListener('submit',event=>{event.preventDefault();const newText=nameInput.value.trim();if(!newText){nameInput.focus();return;}const previous={text:task.text,date:task.date};task.text=newText;task.date=dateInput.value;if(!persist()){task.text=previous.text;task.date=previous.date;$('#task-status').textContent='Aanpassen is niet opgeslagen. De oude taak is behouden.';renderTasks();return;}$('#task-status').textContent='Taak aangepast en opgeslagen: '+newText;renderTasks();});
  li.replaceChildren(form);nameInput.focus();
}),makeButton('Verwijder','secondary',()=>{
  const confirmation=document.createElement('div');confirmation.className='task-delete-confirmation';
  const question=document.createElement('p');question.textContent='Wil je deze taak echt verwijderen? '+task.text;
  const actions=document.createElement('div');actions.className='form-row';
  const yes=makeButton('Ja, verwijderen','secondary',()=>{
    const removed=data.tasks.splice(i,1)[0];if(!persist()){data.tasks.splice(i,0,removed);$('#task-status').textContent='Verwijderen is niet gelukt. De taak is behouden.';renderTasks();return;}$('#task-status').textContent='Taak verwijderd: '+removed.text;renderTasks();
  });
  const no=makeButton('Nee, bewaren','secondary',()=>{renderTasks();$('#task-status').textContent='Taak bewaard: '+task.text;});
  actions.append(yes,no);confirmation.append(question,actions);li.replaceChildren(confirmation);no.focus();
}));ul.append(li);});if(!ul.children.length){const empty=document.createElement('li');empty.className='empty-state';empty.textContent=taskFilter==='done'?'Nog geen afgeronde taken.':taskFilter==='today'?'Geen taken voor vandaag.':taskFilter==='tomorrow'?'Geen taken voor morgen.':'Geen openstaande taken. Goed gedaan!';ul.append(empty);}}
$('#task-form').addEventListener('submit',e=>{e.preventDefault();const text=$('#task').value.trim();if(!text){$('#task-status').textContent='Vul eerst in wat je wilt doen.';$('#task').focus();return;}data.tasks.push({text,done:false,date:$('#task-date').value||''});if(!persist()){data.tasks.pop();renderTasks();$('#task-status').textContent='Taak niet opgeslagen. Je tekst blijft staan. Maak ruimte vrij en probeer het opnieuw.';$('#task').focus();return;}renderTasks();$('#task-status').textContent='Taak toegevoegd en opgeslagen: '+text;$('#task').value='';$('#task-date').value='';$('#task').focus();});
function renderAppointments(){const ul=$('#appointment-list');ul.replaceChildren();if(data.appointments.length===0){const empty=document.createElement('li');empty.className='empty-state';empty.textContent='Je hebt nog geen afspraken. Voeg hierboven een afspraak toe.';ul.append(empty);return;}const sorted=[...data.appointments].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));sorted.forEach(item=>{const li=document.createElement('li');const date=new Date(item.date+'T'+item.time);const when=date.toLocaleDateString('nl-NL',{weekday:'short',day:'numeric',month:'short',year:'numeric'})+' om '+item.time;const strong=document.createElement('strong');strong.textContent=item.title;const p=document.createElement('p');p.textContent=when;li.append(strong,p,makeButton('Verwijder afspraak','secondary',()=>{const previousAppointments=data.appointments;data.appointments=data.appointments.filter(a=>a.id!==item.id);if(!persist()){data.appointments=previousAppointments;$('#appointment-status').textContent='Verwijderen is niet gelukt. De afspraak is behouden.';renderAppointments();return;}$('#appointment-status').textContent='Afspraak verwijderd: '+item.title;renderAppointments();}));ul.append(li);});}
const today=new Date();const todayISO=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');$('#appointment-date').min=todayISO;$('#appointment-date').value=todayISO;
$('#appointment-form').addEventListener('submit',e=>{e.preventDefault();const title=$('#appointment-title').value.trim(),date=$('#appointment-date').value,time=$('#appointment-time').value;const status=$('#appointment-status');if(!title){status.textContent='Vul eerst een naam in voor je afspraak.';$('#appointment-title').focus();return;}if(!date||!time){status.textContent='Vul de datum en tijd van je afspraak in.';return;}if(date<todayISO){status.textContent='Kies vandaag of een datum in de toekomst voor deze afspraak.';return;}const now=new Date();const currentTime=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');if(date===todayISO&&time<currentTime){status.textContent='Dit tijdstip is vandaag al voorbij. Kies een latere tijd.';return;}const conflict=data.appointments.find(a=>a.date===date&&a.time===time);if(conflict){status.textContent='Dit tijdstip is al bezet door “'+conflict.title+'”. Kies een andere tijd.';return;}data.appointments.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),title,date,time});if(!persist()){data.appointments.pop();renderAppointments();status.textContent='Afspraak niet opgeslagen. Je gegevens blijven staan. Maak ruimte vrij en probeer het opnieuw.';$('#appointment-title').focus();return;}renderAppointments();status.textContent='Afspraak opgeslagen op dit apparaat: '+title+' op '+date+' om '+time+'.';$('#appointment-title').value='';$('#appointment-title').focus();});
const moodMessages={Groen:'Fijn als je rustig bent. Je kunt doorgaan op jouw tempo.',Oranje:'Misschien helpt het om even pauze te nemen, rustiger te ademen of minder prikkels op te zoeken.',Rood:'Je mag stoppen. Zoek een rustige plek of iemand bij wie jij je veilig voelt.'};
function showMood(){ $$('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mood===data.mood))); if(data.mood){$('#mood-status').textContent='Je koos: '+data.mood;$('#help').hidden=false;$('#help').textContent=moodMessages[data.mood]||'';}else{$('#mood-status').textContent='Je hebt nog niets gekozen.';$('#help').hidden=true;}}
$$('[data-mood]').forEach(b=>{b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{const previousMood=data.mood;data.mood=b.dataset.mood;if(!persist()){data.mood=previousMood;showMood();$('#mood-status').textContent='Je gevoel kon niet worden opgeslagen. De vorige keuze is behouden.';return;}showMood();});});
const homeSections=[...document.querySelectorAll('main > section:not(.feature)')];
const homeFooter=$('.site-footer');
let currentScreen='';
function showScreen(target,updateHistory=true){
  const section=document.getElementById(target);
  if(target!=='home'&&(!section||!['planning','gevoelens','communicatie','doelen','dagboek','instellingen','afspraken','tekenen'].includes(target)))return;
  currentScreen=target;
  const home=target==='home';
  homeSections.forEach(el=>el.hidden=!home || (el.id==='gevoelens'&&target==='gevoelens'));
  $$('.feature').forEach(el=>el.hidden=el.id!==target);
  if(target==='gevoelens')$('#gevoelens').hidden=false;
  homeFooter.hidden=!home;
  document.body.classList.toggle('screen-open',!home);
  const heading=home?$('.welcome h2'):section.querySelector('h2');
  document.title=home?'MijnMoment':heading.textContent.trim()+' – MijnMoment';
  window.scrollTo({top:0,behavior:'instant'});
  if(updateHistory){
    history.pushState({screen:target},'',home?location.pathname+location.search:'#'+target);
    if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  }
}
function returnToHome(){showScreen('home');}
$$('.feature').forEach(section=>{const back=makeButton('← Terug naar start','secondary',returnToHome);back.classList.add('back-home');section.prepend(back);});
const feelingsBack=makeButton('← Terug naar start','secondary',returnToHome);
feelingsBack.classList.add('back-home');$('#gevoelens').prepend(feelingsBack);
$$('[data-target]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.target)));
window.addEventListener('popstate',()=>showScreen(location.hash.slice(1)||'home',false));
showScreen(location.hash.slice(1)||'home',false);
$$('[data-phrase]').forEach(b=>b.addEventListener('click',()=>{const area=$('#say-text');area.value=b.dataset.phrase;area.focus();$('#speech-status').textContent='Zin gekozen. Je kunt hem aanpassen of laten voorlezen.';}));
$('#speak').addEventListener('click',()=>{const text=$('#say-text').value.trim(),status=$('#speech-status');if(!text){status.textContent='Typ eerst een zin of kies een voorbeeldzin.';$('#say-text').focus();return;}if(!('speechSynthesis'in window)){status.textContent='Voorlezen wordt niet ondersteund door deze browser.';return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='nl-NL';utterance.onstart=()=>status.textContent='Ik lees je tekst voor.';utterance.onend=()=>status.textContent='Voorlezen is klaar.';utterance.onerror=()=>status.textContent='Voorlezen lukte niet. Probeer het opnieuw.';speechSynthesis.speak(utterance);});
$('#clear-speech').addEventListener('click',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();$('#say-text').value='';$('#say-text').focus();$('#speech-status').textContent='De tekst is gewist.';});
$('#diary').value=data.diary||'';
$('#save-diary').addEventListener('click',()=>{data.diary=$('#diary').value;if(persist()){$('#diary-status').textContent='Je dagboek is opgeslagen op dit apparaat.';}else{$('#diary-status').textContent='Je dagboek kon niet worden opgeslagen. Maak ruimte vrij op je apparaat en probeer het opnieuw.';}});
$('#clear-diary').addEventListener('click',()=>{if(!$('#diary').value.trim()&&!data.diary){$('#diary-status').textContent='Je dagboek is al leeg.';return;}if(!window.confirm('Weet je zeker dat je je dagboektekst wilt wissen? Dit kan niet ongedaan worden gemaakt.')){$('#diary-status').textContent='Je dagboek is niet gewist.';return;}const previousDiary=data.diary;data.diary='';if(!persist()){data.diary=previousDiary;$('#diary-status').textContent='Wissen is niet gelukt. Je opgeslagen dagboektekst is behouden.';return;}$('#diary').value='';$('#diary-status').textContent='Je dagboektekst is gewist van dit apparaat.';$('#diary').focus();});
$('#dictate-diary').addEventListener('click',()=>{const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;const status=$('#dictation-status');if(!SpeechRecognition){status.textContent='Spraakherkenning wordt niet ondersteund in deze browser. Je kunt je tekst zelf typen.';return;}const recognition=new SpeechRecognition();recognition.lang='nl-NL';recognition.interimResults=false;recognition.maxAlternatives=1;status.textContent='Ik luister…';recognition.onresult=e=>{const spoken=e.results[0][0].transcript;const area=$('#diary');area.value=(area.value.trim()?area.value.trim()+' ':'')+spoken;status.textContent='Je spraak is omgezet naar tekst. Bewaar je dagboek om het te bewaren.';};recognition.onerror=e=>{status.textContent=e.error==='not-allowed'?'Microfoontoegang is niet toegestaan. Controleer je browserinstellingen.':'Inspreken lukte niet. Probeer het opnieuw of typ je tekst.';};recognition.onend=()=>{if(status.textContent==='Ik luister…')status.textContent='Geen spraak herkend. Probeer het opnieuw.';};try{recognition.start();}catch{status.textContent='Inspreken kan nu niet starten. Probeer het opnieuw.';}});
function applyDisplaySettings(){document.documentElement.style.fontSize=(17*(Number(data.fontScale)||1))+'px';document.body.classList.toggle('high-contrast',!!data.highContrast);$('#display-status').textContent='Tekstgrootte: '+Math.round((Number(data.fontScale)||1)*100)+'%. Hoog contrast: '+(data.highContrast?'aan':'uit')+'.';}
function changeFontScale(delta){const previousScale=data.fontScale;data.fontScale=Math.max(.85,Math.min(1.5,Math.round(((Number(data.fontScale)||1)+delta)*100)/100));if(!persist()){data.fontScale=previousScale;applyDisplaySettings();$('#display-status').textContent='Tekstgrootte niet opgeslagen. De vorige instelling is behouden.';return;}applyDisplaySettings();}
$('#font-smaller').addEventListener('click',()=>changeFontScale(-.1));
$('#font-larger').addEventListener('click',()=>changeFontScale(.1));
$('#contrast-toggle').addEventListener('click',()=>{const previousContrast=data.highContrast;data.highContrast=!data.highContrast;if(!persist()){data.highContrast=previousContrast;applyDisplaySettings();$('#display-status').textContent='Contrast niet opgeslagen. De vorige instelling is behouden.';return;}applyDisplaySettings();});
const goalLabels=['Ik neem een rustmoment','Ik drink wat water','Ik doe iets wat ik leuk vind'];
function updateGoalsStatus(){const checked=data.goals.filter(Boolean).length,total=$$('.checklist input[type=checkbox]').length;const status=$('#goals-status'),progress=$('#goals-progress');if(progress){progress.max=total;progress.value=checked;progress.textContent=`${checked} van ${total}`;}if(!status)return;status.textContent=checked===0?'Je hebt nog geen stapjes afgevinkt.':checked===total?'Geweldig! Je hebt alle drie de stapjes afgevinkt.':`Goed bezig! Je hebt ${checked} van de ${total} stapjes afgevinkt.`;}
$$('.checklist input[type=checkbox]').forEach((cb,i)=>{cb.checked=!!data.goals[i];cb.addEventListener('change',()=>{const previousGoal=data.goals[i];data.goals[i]=cb.checked;if(!persist()){data.goals[i]=previousGoal;cb.checked=previousGoal;updateGoalsStatus();$('#goals-status').textContent='Je stapje kon niet worden opgeslagen. De vorige stand is behouden.';return;}updateGoalsStatus();});});
updateGoalsStatus();
const canvas=$('#drawing'),ctx=canvas.getContext('2d');ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#2874c8';let drawing=false;
function pos(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height};}
canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);});
canvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();});
function saveDrawing(){const previousDrawing=data.drawing;try{data.drawing=canvas.toDataURL('image/png');if(!persist()){data.drawing=previousDrawing;$('#drawing-status').textContent='Je tekening is zichtbaar, maar niet opgeslagen. De vorige opgeslagen tekening is behouden.';}}catch{data.drawing=previousDrawing;$('#drawing-status').textContent='De tekening kon niet worden opgeslagen. De vorige opgeslagen tekening is behouden.';}}
['pointerup','pointercancel','lostpointercapture'].forEach(n=>canvas.addEventListener(n,()=>{if(drawing){drawing=false;saveDrawing();}}));
if(typeof data.drawing==='string'&&data.drawing.startsWith('data:image/png;base64,')){const savedDrawing=new Image();savedDrawing.onload=()=>{if(data.drawing===savedDrawing.src)ctx.drawImage(savedDrawing,0,0,canvas.width,canvas.height);};savedDrawing.src=data.drawing;}
$('#clear-drawing').addEventListener('click',()=>{const previousDrawing=data.drawing;data.drawing='';if(!persist()){data.drawing=previousDrawing;$('#drawing-status').textContent='Wissen niet opgeslagen. De vorige opgeslagen tekening is behouden.';return;}ctx.clearRect(0,0,canvas.width,canvas.height);$('#drawing-status').textContent='Je tekening is gewist.';});
$('#download-drawing').addEventListener('click',()=>{const a=document.createElement('a');a.download='mijnmoment-tekening.png';a.href=canvas.toDataURL('image/png');a.click();$('#drawing-status').textContent='Je tekening wordt gedownload als PNG.';});
$('#export-data').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mijnmoment-gegevens.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);});
$('#import-data').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async e=>{
  const file=e.target.files&&e.target.files[0];
  e.target.value='';
  if(!file)return;
  if(file.size>5*1024*1024){$('#settings-status').textContent='Dit back-upbestand is te groot (maximaal 5 MB).';return;}
  try{
    const incoming=JSON.parse(await file.text());
    const valid= incoming&&typeof incoming==='object'&&!Array.isArray(incoming)
      &&Array.isArray(incoming.tasks)&&incoming.tasks.length<=1000&&incoming.tasks.every(x=>x&&typeof x.text==='string'&&x.text.length<=120&&typeof x.done==='boolean')
      &&Array.isArray(incoming.appointments)&&incoming.appointments.length<=1000&&new Set(incoming.appointments.map(x=>x&&x.id)).size===incoming.appointments.length&&incoming.appointments.every(x=>x&&typeof x.id==='string'&&x.id.length>0&&typeof x.title==='string'&&x.title.trim().length>0&&x.title.length<=120&&typeof x.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x.date)&&(()=>{const d=new Date(x.date+'T00:00:00');return !Number.isNaN(d.getTime())&&d.toISOString().slice(0,10)===x.date})()&&typeof x.time==='string'&&/^([01]\d|2[0-3]):[0-5]\d$/.test(x.time))
      &&Array.isArray(incoming.goals)&&incoming.goals.length===3&&incoming.goals.every(x=>typeof x==='boolean')
      &&typeof incoming.diary==='string'&&incoming.diary.length<=100000&&['','Groen','Oranje','Rood'].includes(incoming.mood)
      &&(incoming.drawing===''||(typeof incoming.drawing==='string'&&incoming.drawing.length<=4*1024*1024&&/^data:image\/png;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(incoming.drawing)&&incoming.drawing.length>22))
      &&(incoming.fontScale===undefined||Number.isFinite(Number(incoming.fontScale)))
      &&(incoming.highContrast===undefined||typeof incoming.highContrast==='boolean');
    if(!valid){$('#settings-status').textContent='Deze back-up is ongeldig of niet van MijnMoment. Je gegevens zijn niet gewijzigd.';return;}
    if(!confirm('Een back-up terugzetten vervangt de huidige gegevens op dit apparaat. Download eerst een back-up als je niets wilt verliezen. Doorgaan?'))return;
    const previous=data;
    data={...defaults,...incoming,fontScale:Math.max(.85,Math.min(1.5,Number(incoming.fontScale??1))),highContrast:incoming.highContrast===true};
    if(!persist()){data=previous;$('#settings-status').textContent='Terugzetten is niet gelukt. Je huidige gegevens zijn behouden.';return;}
    $('#diary').value=data.diary;$('#say-text').value='';
    $$('.checklist input[type=checkbox]').forEach((cb,i)=>cb.checked=!!data.goals[i]);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(data.drawing){const restored=new Image();restored.onload=()=>{if(data.drawing===restored.src)ctx.drawImage(restored,0,0,canvas.width,canvas.height);};restored.src=data.drawing;}
    renderTasks();renderAppointments();showMood();applyDisplaySettings();updateGoalsStatus();
    $('#settings-status').textContent='Back-up teruggezet. Je gegevens zijn opgeslagen op dit apparaat.';
  }catch{$('#settings-status').textContent='Het back-upbestand kon niet worden gelezen. Controleer het bestand en probeer opnieuw.';}
});
$('#delete-data').addEventListener('click',()=>{if(!confirm('Weet je zeker dat je alle lokaal bewaarde MijnMoment-gegevens wilt verwijderen?'))return;localStorage.removeItem(key);localStorage.removeItem('mijnmoment-data-v1');if(nativeStorage){nativeStorage.remove({key}).catch(()=>{$('#settings-status').textContent='Verwijderen uit Android-opslag is niet gelukt.';});}data={...defaults,tasks:[],appointments:[],goals:[false,false,false]};$('#diary').value='';$('#say-text').value='';if('speechSynthesis'in window)speechSynthesis.cancel();$('#speech-status').textContent='';$('#dictation-status').textContent='';ctx.clearRect(0,0,canvas.width,canvas.height);$$('.checklist input[type=checkbox]').forEach(cb=>cb.checked=false);updateGoalsStatus();renderTasks();renderAppointments();showMood();applyDisplaySettings();$('#settings-status').textContent='Je lokale gegevens zijn verwijderd.';$('#appointment-status').textContent='';$('#diary-status').textContent='';});
renderTasks();renderAppointments();showMood();applyDisplaySettings();
$('#storage-diagnostic').textContent=storageDiagnostic()+' · Start: klaar';
if(!window.Capacitor?.isNativePlatform?.()&&'serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

})().catch(error=>{console.error('MijnMoment kon niet starten',error);const status=document.querySelector('#storage-diagnostic');if(status)status.textContent='Opslagcontrole: opstartfout ('+(error?.message||'onbekend')+')';});
