var express = require('express');
var router = express.Router();
var alunosApp = require("../apps/leitor/controller/ctlLeitor.js")



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
router.get('/manutLeitor', authenticationMiddleware, leitorApp.manutLeitor)
router.get('/insertLeitor', authenticationMiddleware, leitorApp.insertLeitor);
router.get('/viewLeitor/:id', authenticationMiddleware, leitorApp.ViewLeitor);
router.get('/updateLeitor/:id', authenticationMiddleware, leitorApp.UpdateLeitor);

/* POST métodos */
router.post('/insertLeitor', authenticationMiddleware, leitorApp.insertLeitor);
router.post('/updateLeitor', authenticationMiddleware, leitorApp.updateLeitor);
router.post('/deleteLeitor', authenticationMiddleware, leitorApp.deleteLeitor);
// router.post('/viewAlunos', authenticationMiddleware, alunosApp.viewAlunos);


module.exports = router;
