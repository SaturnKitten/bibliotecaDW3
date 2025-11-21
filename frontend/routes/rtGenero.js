var express = require('express');
var router = express.Router();
var generoApp = require("../apps/genero/controller/ctlGenero.js")



//Função necessária para evitar que usuários não autenticados acessem o sistema.
function authenticationMiddleware(req, res, next) {
    // Verificar se existe uma sessão válida.
    isLogged = req.session.isLogged;    
  
    if (!isLogged) {      
      res.redirect("/Login");
    }
    next();
}; 
  
/* GET métodos */
router.get('/manutGenero', authenticationMiddleware, generoApp.manutGenero)
router.get('/insertGenero', authenticationMiddleware, generoApp.insertGenero);
router.get('/viewGenero/:id', authenticationMiddleware, generoApp.viewGenero);
router.get('/updateGenero/:id', authenticationMiddleware, generoApp.updateGenero);

/* POST métodos */
router.post('/insertGenero', authenticationMiddleware, generoApp.insertGenero);
router.post('/updateGenero', authenticationMiddleware, generoApp.updateGenero);
router.post('/deleteGenero', authenticationMiddleware, generoApp.deleteGenero);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;
