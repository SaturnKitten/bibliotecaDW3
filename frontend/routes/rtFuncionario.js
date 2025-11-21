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
router.get('/manutFuncionario', authenticationMiddleware, funcionarioApp.manutFuncionario)
router.get('/insertFuncionario', authenticationMiddleware, funcionarioApp.insertFuncionario);
router.get('/viewFuncionario/:id', authenticationMiddleware, funcionarioApp.ViewFuncionario);
router.get('/updateFuncionario/:id', authenticationMiddleware, funcionarioApp.UpdateFuncionario);

/* POST métodos */
router.post('/insertFuncionario', authenticationMiddleware, funcionarioApp.insertFuncionario);
router.post('/updateFuncionario', authenticationMiddleware, funcionarioApp.UpdateFuncionario);
router.post('/deleteFuncionario', authenticationMiddleware, funcionarioApp.DeleteFuncionario);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;
