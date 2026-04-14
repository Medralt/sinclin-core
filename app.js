const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB = path.join(__dirname,'db.json');
if(!fs.existsSync(DB)) fs.writeFileSync(DB,'[]');

let pacientes = JSON.parse(fs.readFileSync(DB));

function salvar(){
 fs.writeFileSync(DB, JSON.stringify(pacientes,null,2));
}

app.get('/api/pacientes',(req,res)=>res.json(pacientes));

app.post('/api/pacientes',(req,res)=>{
 const p = {
  id: Date.now(),
  nome:req.body.nome,
  idade:req.body.idade,
  sexo:req.body.sexo,
  historico:[],
  biometria:{}
 };
 pacientes.push(p);
 salvar();
 res.json(p);
});

app.post('/api/ia', async (req,res)=>{

 try{
  const r = await fetch("https://api.openai.com/v1/chat/completions",{
   method:"POST",
   headers:{
    "Content-Type":"application/json",
    "Authorization":"Bearer "+process.env.OPENAI_API_KEY
   },
   body: JSON.stringify({
    model:"gpt-4.1-mini",
    messages:[
     {role:"system",content:"Sistema clínico SINCLIN. Seja direto e clínico."},
     {role:"user",content:req.body.texto}
    ]
   })
  });

  const d = await r.json();

  res.json({
    resposta: d.choices?.[0]?.message?.content || "sem resposta"
  });

 }catch(e){
  res.json({resposta:"IA indisponível"});
 }

});

app.listen(3000);
