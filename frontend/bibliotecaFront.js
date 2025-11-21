var createError = require('http-errors');
var nunjucks = require("nunjucks");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');

// 1. Configuração do Arquivo de Variáveis de Ambiente (.env)
// Mudei o nome para algo genérico ou o nome que você usa no projeto
const envFilePath = path.resolve(__dirname, './.env'); 
require('dotenv').config({ path: envFilePath });

const port = process.env.PORT || 3000; // Adicionei um fallback para 3000 se não tiver no .env

// 2. Importação das Rotas (Controllers de Rota) do seu Projeto
var rtIndex = require('./routes/rtIndex');       // Login e Logout
var rtFuncionarios = require('./routes/rtFuncionario');
var rtLeitores = require('./routes/rtLeitor');
var rtLivros = require('./routes/rtLivro');
var rtGeneros = require('./routes/rtGenero');
var rtEmprestimos = require('./routes/rtEmprestimo');

// const jwtchave = process.env.JWTCHAVE; // Geralmente não precisa declarar global aqui, usa-se na session

var app = express();

// 3. Configuração do Template Engine (Nunjucks)
// Aponta para a pasta 'apps' onde devem estar suas views (ex: apps/funcionarios/view/...)
nunjucks.configure('apps', {
    autoescape: true,
    express: app,
    watch: true
});

// Configura arquivos estáticos (CSS, JS, Imagens)
app.use(express.static(__dirname)); 
// Ou se você tiver uma pasta public: app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Configuração da Sessão
app.use(
  session({
    secret: process.env.JWTCHAVE, // A chave secreta usada para assinar o cookie da sessão
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: null },
  })
);

// 5. Definição dos Grupos de Rotas da Biblioteca
app.use('/', rtIndex);               // Rota raiz (Login)
app.use('/funcionarios', rtFuncionarios); // Rotas CRUD de Funcionários
app.use('/leitores', rtLeitores);    // Rotas CRUD de Leitores
app.use('/livros', rtLivros);        // Rotas CRUD de Livros
app.use('/generos', rtGeneros);      // Rotas CRUD de Gêneros
app.use('/emprestimos', rtEmprestimos); // Rotas CRUD de Empréstimos

// Tratamento de erro 404 (Opcional, mas recomendado)
app.use(function(req, res, next) {
  next(createError(404));
});

// 6. Inicialização do Servidor
app.listen(port, () => {
  console.log(`Biblioteca Front rodando na porta ${port}`);
})