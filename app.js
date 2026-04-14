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