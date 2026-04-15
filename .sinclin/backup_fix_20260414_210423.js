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
        let d = read('pacientes.json');

        let novo = {
            id: randomUUID(),
            nome: req.body.nome,
            created: new Date()
        };

        d.push(novo);
        write('pacientes.json',d);

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

app.post('/sinclin-ai-clinico', async (req, res) => {
    try {

        if (!process.env.OPENAI_API_KEY) {
            return res.json({ result: "IA temporariamente indisponivel" });
        }

        const { respostas } = req.body;

        const prompt = 
Analise clinica estetica:


Contexto:
Dr Marino Mende Macedo

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

        res.json({
            result: data?.choices?.[0]?.message?.content || "Sem resposta IA"
        });

    } catch (e) {
        res.json({ result: "Erro IA" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("SINCLIN_BACKEND_OK_PORT_" + PORT);
});
