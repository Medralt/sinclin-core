async function carregar(){
 const r = await fetch('/api/pacientes');
 const d = await r.json();
 let html='';
 d.forEach(p=>{
  html += '<div>'+p.nome+' - '+p.idade+'</div>';
 });
 lista.innerHTML = html;
}

async function cadastrar(){
 await fetch('/api/pacientes',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
   nome:nome.value,
   idade:idade.value,
   sexo:sexo.value
  })
 });
 carregar();
}

async function enviar(){
 const r = await fetch('/api/ia',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({texto:pergunta.value})
 });
 const d = await r.json();
 resposta.innerText = d.resposta;
 falar(d.resposta);
}

function voz(){
 const rec = new (window.SpeechRecognition||window.webkitSpeechRecognition)();
 rec.lang='pt-BR';
 rec.start();

 rec.onresult = function(e){
  pergunta.value = e.results[0][0].transcript;
  enviar();
 };
}

function falar(t){
 const u = new SpeechSynthesisUtterance(t);
 u.lang='pt-BR';
 speechSynthesis.speak(u);
}

window.onload = carregar;
