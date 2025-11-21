//Importações
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();


//Importação do roteador
const router = require('./routes/router');

const app = express();
//Definição da porta
const port = 40000;

app.use(bodyParser.urlencoded({ extended: false, }));
app.use(express.json());

//Utiliza routerApp de /routes/router.js
app.use(router);

//Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});