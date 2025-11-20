var express = require('express');
var router = express.Router();
var alunosApp = require("../apps/emprestimo/controller/ctlEmprestimo");



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
router.get('/manutEmprestimo', authenticationMiddleware, alunosApp.manutAlunos)
router.get('/insertEmprestimo', authenticationMiddleware, alunosApp.insertAlunos);
router.get('/viewEmprestimo/:id', authenticationMiddleware, alunosApp.ViewAlunos);
router.get('/updateEmprestimo/:id', authenticationMiddleware, alunosApp.UpdateAluno);

/* POST métodos */
router.post('/insertEmprestimo', authenticationMiddleware, alunosApp.insertAlunos);
router.post('/updateEmprestimo', authenticationMiddleware, alunosApp.UpdateAluno);
router.post('/deleteEmprestimo', authenticationMiddleware, alunosApp.DeleteAluno);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;