var express = require('express');
var router = express.Router();
var alunosApp = require("..\apps\funcionario\controller\ctlFuncionario.js")



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
router.get('/manutFuncionario', authenticationMiddleware, alunosApp.manutAlunos)
router.get('/insertFuncionario', authenticationMiddleware, alunosApp.insertAlunos);
router.get('/viewFuncionario/:id', authenticationMiddleware, alunosApp.ViewAlunos);
router.get('/updateFuncionario/:id', authenticationMiddleware, alunosApp.UpdateAluno);

/* POST métodos */
router.post('/insertFuncionario', authenticationMiddleware, alunosApp.insertAlunos);
router.post('/updateFuncionario', authenticationMiddleware, alunosApp.UpdateAluno);
router.post('/deleteFuncionario', authenticationMiddleware, alunosApp.DeleteAluno);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;