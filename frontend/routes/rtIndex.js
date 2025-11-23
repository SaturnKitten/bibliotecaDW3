var express = require('express');
var router = express.Router();
var loginApp = require("../apps/login/controller/ctlLogin")

//Função necessária para evitar que usuários não autenticados acessem o sistema.
router.get('/', function(req, res, next) {
  // Verificar se existe uma sessão válida.
  isLogged = req.session.isLogged;

  if (!isLogged) {
    return res.redirect("/Login");
  }
  
  username = req.session.username;
  res.render('home/view/index.njk', { "title": 'Biblioteca Home', "username": username });
});


// GET e POST Login, GET Logout
router.get('/Login', loginApp.Login);
router.post('/Login', loginApp.Login);
router.get('/Logout', loginApp.Logout);

module.exports = router;