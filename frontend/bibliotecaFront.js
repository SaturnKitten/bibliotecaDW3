var createError = require('http-errors');
var nunjucks = require("nunjucks");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');

// Configuração do Arquivo de Variáveis de Ambiente (.env)
const envFilePath = path.resolve(__dirname, 'bibliotecaFront.env');
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT;

//Importação das Rotas (Controllers de Rota)
var rtIndex = require('./routes/rtIndex');
var rtFuncionarios = require('./routes/rtFuncionario');
var rtLeitores = require('./routes/rtLeitor');
var rtLivros = require('./routes/rtLivro');
var rtGeneros = require('./routes/rtGenero');
var rtEmprestimos = require('./routes/rtEmprestimo');

var app = express();

// Configuração do Template Engine (Nunjucks)
// Aponta para a pasta 'apps'
nunjucks.configure('apps', {
    autoescape: true,
    express: app,
    watch: true
});

app.set('view engine', 'njk');

// Configura arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(__dirname)); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuração da Sessão
app.use(
  session({
    secret: process.env.JWTCHAVE, // A chave secreta usada para assinar o cookie da sessão
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);

// Definição dos Grupos de Rotas da Biblioteca
app.use('/', rtIndex);               // Rota raiz (Login)
app.use('/funcionarios', rtFuncionarios); // Rotas CRUD de Funcionários
app.use('/leitores', rtLeitores);    // Rotas CRUD de Leitores
app.use('/livros', rtLivros);        // Rotas CRUD de Livros
app.use('/generos', rtGeneros);      // Rotas CRUD de Gêneros
app.use('/emprestimos', rtEmprestimos); // Rotas CRUD de Empréstimos

// Tratamento de erro 404
app.use(function(req, res, next) {
  next(createError(404));
});

// 6. Inicialização do Servidor
app.listen(port, () => {
  console.log(`Biblioteca Front rodando na porta ${port}`);
})