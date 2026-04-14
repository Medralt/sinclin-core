const express = require('express');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const DATA_DIR = path.join(__dirname, 'data');

function read(file){
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR,file)));
}

function write(file,data){
    fs.writeFileSync(path.join(DATA_DIR,file), JSON.stringify(data,null,2));
}

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'public','sinclin_ultra.html'));
});

app.get('/data/:type',(req,res)=>{
    try{
        let d = read(req.params.type + '.json');
        res.json(d);
    }catch(e){
        res.json([]);
    }
});

app.post('/data/pacientes',(req,res)=>{
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
    }catch(e){
        res.json({ok:false});
    }
});

app.post('/data/:type',(req,res)=>{
    try{
        let file = req.params.type + '.json';
        let d = read(file);
        d.push(req.body);
        write(file,d);
        res.json({ok:true});
    }catch(e){
        res.json({ok:false});
    }
});

let SINCLIN_USER = { nivel: "GUEST" };

app.post('/sinclin-auth',(req,res)=>{
    const { nome } = req.body;

    if(nome && nome.toLowerCase().includes("marino")){
        SINCLIN_USER = { nivel:"MASTER", nome:"Dr. Marino" };
        return res.json({status:"MASTER_OK"});
    }

    if(nome && nome.toLowerCase().includes("marilda")){
        SINCLIN_USER = { nivel:"OPERACIONAL", nome:"Marilda" };
        return res.json({status:"USER_OK"});
    }

    res.json({status:"NEGADO"});
});

app.post('/sinclin-ai-clinico', async (req, res) => {
    try {
        const { respostas } = req.body;

        const prompt = 
Analise clinica estetica:


Contexto do profissional:
Dr Marino Mende Macedo
Formacao:
- Sociologo
- Historia e Geografia
- Psicologia
- Psicanalise Lacaniana
- Biomedicina Estetica
- Saude Integrativa
- Disbiose Funcional
- Ortomolecular

Gere:
- padrao clinico
- sugestao de tratamento
- nivel de gravidade
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

app.listen(3000, () => {
    console.log("SINCLIN_BACKEND_OK_PORT_3000");
});
