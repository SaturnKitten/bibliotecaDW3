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
router.get('/manutGenero', authenticationMiddleware, alunosApp.manutAlunos)
router.get('/insertGenero', authenticationMiddleware, alunosApp.insertAlunos);
router.get('/viewGenero/:id', authenticationMiddleware, alunosApp.ViewAlunos);
router.get('/updateGenero/:id', authenticationMiddleware, alunosApp.UpdateAluno);

/* POST métodos */
router.post('/insertGenero', authenticationMiddleware, alunosApp.insertAlunos);
router.post('/updateGenero', authenticationMiddleware, alunosApp.UpdateAluno);
router.post('/deleteGenero', authenticationMiddleware, alunosApp.DeleteAluno);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;