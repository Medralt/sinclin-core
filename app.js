require('dotenv').config()
global.fetch = global.fetch || require('node:undici').fetch
const express=require('express')
const fetch=
const fs=require('fs')
const path=require('path')

const app=express()
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

const DB='db.json'
let pacientes=[]
try{pacientes=JSON.parse(fs.readFileSync(DB,'utf8'))}catch{pacientes=[]}

function salvar(){fs.writeFileSync(DB,JSON.stringify(pacientes,null,2))}

app.get('/api/pacientes',(req,res)=>res.json(pacientes))

app.post('/api/pacientes',(req,res)=>{
 const p={id:Date.now(),nome:req.body.nome,idade:req.body.idade,sexo:req.body.sexo}
 pacientes.push(p);salvar();res.json(p)
})

app.post('/api/ia',async(req,res)=>{
 const texto=req.body.texto

 try{
  const r=await fetch('https://api.openai.com/v1/chat/completions',{
   method:'POST',
   headers:{
    'Content-Type':'application/json',
    'Authorization':'Bearer '+process.env.OPENAI_API_KEY
   },
   body:JSON.stringify({
    model:'gpt-4o-mini',
    messages:[
     {role:'system',content:'IA SINCLIN avan?ada. Responda com racioc?nio cl?nico e intera??o real.'},
     {role:'user',content:texto}
    ]
   })
  })

  const d=await r.json()

  const resp=d.choices?.[0]?.message?.content || "IA sem retorno"
  res.json({resposta:resp})

 }catch(e){
  res.json({resposta:"IA erro interno"})
 }
})

app.listen(3000)
