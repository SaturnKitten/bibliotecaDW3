var express = require('express');
var router = express.Router();
var alunosApp = require("..\apps\genero\controller\ctlGenero.js")



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
router.get('/manutGenero', authenticationMiddleware, alunosApp.manutGenero)
router.get('/insertGenero', authenticationMiddleware, alunosApp.insertGenero);
router.get('/viewGenero/:id', authenticationMiddleware, alunosApp.ViewGenero);
router.get('/updateGenero/:id', authenticationMiddleware, alunosApp.UpdateGenero);

/* POST métodos */
router.post('/insertGenero', authenticationMiddleware, alunosApp.insertGenero);
router.post('/updateGenero', authenticationMiddleware, alunosApp.UpdateGenero);
router.post('/deleteGenero', authenticationMiddleware, alunosApp.DeleteGenero);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;
