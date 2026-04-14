const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

const DB = 'db.json'

let pacientes = []
try {
 pacientes = JSON.parse(fs.readFileSync(DB,'utf8'))
} catch {
 pacientes = []
}

function salvar(){
 fs.writeFileSync(DB, JSON.stringify(pacientes,null,2))
}

app.get('/api/pacientes',(req,res)=>{
 res.json(pacientes)
})

app.post('/api/pacientes',(req,res)=>{
 const p = {
  id: Date.now(),
  nome: req.body.nome,
  idade: req.body.idade,
  sexo: req.body.sexo
 }

 pacientes.push(p)
 salvar()
 res.json(p)
})

app.post('/api/ia', async (req,res)=>{

 const texto = req.body.texto

 if(!process.env.OPENAI_API_KEY){
  return res.json({resposta:"ERRO: SEM KEY"})
 }

 try{

  const r = await fetch('https://api.openai.com/v1/chat/completions',{
   method:'POST',
   headers:{
    'Content-Type':'application/json',
    'Authorization':'Bearer ' + process.env.OPENAI_API_KEY
   },
   body: JSON.stringify({
    model:'gpt-4o-mini',
    messages:[
     {role:'system',content:'IA cl?nica SINCLIN. Responda com clareza e l?gica.'},
     {role:'user',content:texto}
    ]
   })
  })

  const d = await r.json()

  if(d.error){
   return res.json({resposta:"ERRO IA: " + d.error.message})
  }

  res.json({
   resposta: d.choices?.[0]?.message?.content || "SEM RESPOSTA"
  })

 }catch(e){
  res.json({resposta:"FALHA IA"})
 }

})

app.listen(3000)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('server running'));

console.log('SINCLIN_RUNTIME_20260414172346');

app.get('/sinclin-run', (req,res)=>{
    res.json({ok:true});
});

app.post('/sinclin-ai-clinico', async (req, res) => {
    try {
        const { respostas } = req.body;

        const prompt = 
        Analise clínica estética:
        

        Gere:
        - padrão clínico
        - sugestão de tratamento
        - nível de gravidade
        ;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await response.json();
        res.json({ result: data.choices[0].message.content });

    } catch (e) {
        res.status(500).json({ error: "IA_FAIL" });
    }
});

const fs = require('fs');
const path = require('path');

function read(file){
return JSON.parse(fs.readFileSync(path.join(__dirname,'data',file)));
}

function write(file,data){
fs.writeFileSync(path.join(__dirname,'data',file), JSON.stringify(data,null,2));
}

app.get('/data/:type',(req,res)=>{
try{
let d = read(req.params.type + '.json');
res.json(d);
}catch(e){res.json([]);}
});

app.post('/data/:type',(req,res)=>{
try{
let file = req.params.type + '.json';
let d = read(file);
d.push(req.body);
write(file,d);
res.json({ok:true});
}catch(e){res.json({ok:false});}
});

const fs = require('fs');
const path = require('path');

function read(file){
return JSON.parse(fs.readFileSync(path.join(__dirname,'data',file)));
}

function write(file,data){
fs.writeFileSync(path.join(__dirname,'data',file), JSON.stringify(data,null,2));
}

app.get('/data/:type',(req,res)=>{
try{
let d = read(req.params.type + '.json');
res.json(d);
}catch(e){res.json([]);}
});

app.post('/data/:type',(req,res)=>{
try{
let file = req.params.type + '.json';
let d = read(file);
d.push(req.body);
write(file,d);
res.json({ok:true});
}catch(e){res.json({ok:false});}
});

const { randomUUID } = require('crypto');

app.post('/data/pacientes', (req,res)=>{
try{
let file='pacientes.json';
let d = read(file);

let novo = {
id: randomUUID(),
nome: req.body.nome,
created: new Date()
};

d.push(novo);
write(file,d);

res.json(novo);
}catch(e){res.json({ok:false});}
});
