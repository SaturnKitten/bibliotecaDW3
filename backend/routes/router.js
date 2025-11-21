//Importação do Express
const express = require("express");
//Criação do roteador
const routerApp = express.Router();

//Importação dos controllers
const appEmprestimo = require("../apps/emprestimo/controller/ctlEmprestimo");
const appFuncionario = require("../apps/funcionario/controller/ctlFuncionario");
const appGenero = require("../apps/genero/controller/ctlGenero");
const appLeitor = require("../apps/leitor/controller/ctlLeitor");
const appLivro = require("../apps/livro/controller/ctlLivro");
const appLogin = require("../apps/login/controller/ctlLogin");

//Rota de teste da API
routerApp.get("/", (req, res) => {
    res.send("API funcionando");
});

//Rotas de Empréstimo
routerApp.get("/getAllEmprestimo", appLogin.AutenticaJWT, appEmprestimo.getAllEmprestimo);
routerApp.post("/getEmprestimoById", appLogin.AutenticaJWT, appEmprestimo.getEmprestimoById);
routerApp.post("/insertEmprestimo", appLogin.AutenticaJWT, appEmprestimo.insertEmprestimo);
routerApp.post("/updateEmprestimo", appLogin.AutenticaJWT, appEmprestimo.updateEmprestimo);
routerApp.post("/deleteEmprestimo", appLogin.AutenticaJWT, appEmprestimo.deleteEmprestimo);

//Rotas de Funcionário
routerApp.get("/getAllFuncionario", appLogin.AutenticaJWT, appFuncionario.getAllFuncionario);
routerApp.post("/getFuncionarioById", appLogin.AutenticaJWT, appFuncionario.getFuncionarioById);
routerApp.post("/insertFuncionario", appLogin.AutenticaJWT, appFuncionario.insertFuncionario);
routerApp.post("/updateFuncionario", appLogin.AutenticaJWT, appFuncionario.updateFuncionario);
routerApp.post("/deleteFuncionario", appLogin.AutenticaJWT, appFuncionario.deleteFuncionario);

//Rotas de Gênero
routerApp.get("/getAllGenero", appLogin.AutenticaJWT, appGenero.getAllGenero);
routerApp.post("/getGeneroById", appLogin.AutenticaJWT, appGenero.getGeneroById);
routerApp.post("/insertGenero", appLogin.AutenticaJWT, appGenero.insertGenero);
routerApp.post("/updateGenero", appLogin.AutenticaJWT, appGenero.updateGenero);
routerApp.post("/deleteGenero", appLogin.AutenticaJWT, appGenero.deleteGenero);

//Rotas de Leitor
routerApp.get("/getAllLeitor", appLogin.AutenticaJWT, appLeitor.getAllLeitor);
routerApp.post("/getLeitorById", appLogin.AutenticaJWT, appLeitor.getLeitorById);
routerApp.post("/insertLeitor", appLogin.AutenticaJWT, appLeitor.insertLeitor);
routerApp.post("/updateLeitor", appLogin.AutenticaJWT, appLeitor.updateLeitor);
routerApp.post("/deleteLeitor", appLogin.AutenticaJWT, appLeitor.deleteLeitor);

//Rotas de Livro
routerApp.get("/getAllLivro", appLogin.AutenticaJWT, appLivro.getAllLivro);
routerApp.post("/getLivroById", appLogin.AutenticaJWT, appLivro.getLivroById);
routerApp.post("/insertLivro", appLogin.AutenticaJWT, appLivro.insertLivro);
routerApp.post("/updateLivro", appLogin.AutenticaJWT, appLivro.updateLivro);
routerApp.post("/deleteLivro", appLogin.AutenticaJWT, appLivro.deleteLivro);

//Rotas de Login
routerApp.post("/login", appLogin.login);
routerApp.post("/logout", appLogin.AutenticaJWT,  appLogin.logout);

module.exports = routerApp;