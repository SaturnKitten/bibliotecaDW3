var express = require('express');
var router = express.Router();
var alunosApp = require("..\apps\leitor\controller\ctlLeitor.js")



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
router.get('/manutLeitor', authenticationMiddleware, alunosApp.manutAlunos)
router.get('/insertLeitor', authenticationMiddleware, alunosApp.insertAlunos);
router.get('/viewLeitor/:id', authenticationMiddleware, alunosApp.ViewAlunos);
router.get('/updateLeitor/:id', authenticationMiddleware, alunosApp.UpdateAluno);

/* POST métodos */
router.post('/insertLeitor', authenticationMiddleware, alunosApp.insertAlunos);
router.post('/updateLeitor', authenticationMiddleware, alunosApp.UpdateAluno);
router.post('/deleteLeitor', authenticationMiddleware, alunosApp.DeleteAluno);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;