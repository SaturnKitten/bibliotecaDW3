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
router.get('/manutEmprestimo', authenticationMiddleware, emprestimoApp.manutEmprestimo)
router.get('/insertEmprestimo', authenticationMiddleware, emprestimoApp.insertEmprestimo);
router.get('/viewEmprestimo/:id', authenticationMiddleware, emprestimoApp.ViewEmprestimo);
router.get('/updateEmprestimo/:id', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);

/* POST métodos */
router.post('/insertEmprestimo', authenticationMiddleware, emprestimoApp.insertEmprestimo);
router.post('/updateEmprestimo', authenticationMiddleware, emprestimoApp.UpdateEmprestimo);
router.post('/deleteEmprestimo', authenticationMiddleware, emprestimoApp.DeleteEmprestimo);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;
