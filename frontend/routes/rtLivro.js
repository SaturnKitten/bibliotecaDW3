var express = require('express');
var router = express.Router();
var alunosApp = require("..\apps\livro\controller\ctlLivro.js")



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
router.get('/manutLivro', authenticationMiddleware, alunosApp.manutLivro)
router.get('/insertLivro', authenticationMiddleware, alunosApp.insertLivro);
router.get('/viewLivro/:id', authenticationMiddleware, alunosApp.ViewLivro);
router.get('/updateLivro/:id', authenticationMiddleware, alunosApp.UpdateLivro);

/* POST métodos */
router.post('/insertLivro', authenticationMiddleware, alunosApp.insertLivro);
router.post('/updateLivro', authenticationMiddleware, alunosApp.UpdateLivro);
router.post('/deleteLivro', authenticationMiddleware, alunosApp.DeleteLivro);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;