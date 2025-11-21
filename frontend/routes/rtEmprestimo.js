var express = require('express');
var router = express.Router();
var emprestimoApp = require("../apps/emprestimo/controller/ctlEmprestimo");



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
router.get('/viewEmprestimo/:id', authenticationMiddleware, emprestimoApp.viewEmprestimo);
router.get('/updateEmprestimo/:id', authenticationMiddleware, emprestimoApp.updateEmprestimo);

/* POST métodos */
router.post('/insertEmprestimo', authenticationMiddleware, emprestimoApp.insertEmprestimo);
router.post('/updateEmprestimo', authenticationMiddleware, emprestimoApp.updateEmprestimo);
router.post('/deleteEmprestimo', authenticationMiddleware, emprestimoApp.deleteEmprestimo);
// router.post('/viewEmprestimo', authenticationMiddleware, emprestimoApp.viewEmprestimo);


module.exports = router;
