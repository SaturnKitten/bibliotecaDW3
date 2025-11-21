var express = require('express');
var router = express.Router();
var livroApp = require("../apps/livro/controller/ctlLivro.js")



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
router.get('/manutLivro', authenticationMiddleware, livroApp.manutLivro)
router.get('/insertLivro', authenticationMiddleware, livroApp.insertLivro);
router.get('/viewLivro/:id', authenticationMiddleware, livroApp.viewLivro);
router.get('/updateLivro/:id', authenticationMiddleware, livroApp.updateLivro);

/* POST métodos */
router.post('/insertLivro', authenticationMiddleware, livroApp.insertLivro);
router.post('/updateLivro', authenticationMiddleware, livroApp.updateLivro);
router.post('/deleteLivro', authenticationMiddleware, livroApp.deleteLivro);
// router.post('/viewAlunos', authenticationMiddleware, livroApp.viewLivro);


module.exports = router;