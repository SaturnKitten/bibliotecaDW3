const mdlEmprestimo = require('../model/mdlEmprestimo');

//Função para obter todos os empréstimos
const getAllEmprestimo = async (req, res) => {
    try{
        const emprestimo = await mdlEmprestimo.getAllEmprestimo(); // Chama a função do modelo para obter todos os empréstimos
        
        res.json({status: "ok", registros: emprestimo}); // Retorna os empréstimos como resposta JSON
    }
    catch(error){
        console.error("Erro no getAllEmprestimo: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar empréstimos no servidor." });
    }
}

//Função para obter um empréstimo pelo ID
const getEmprestimoById = async (req, res) => {
    try{
        const idEmprestimo = parseInt(req.params.id); // Obtém o ID do empréstimo dos parâmetros da rota

        const emprestimo = await mdlEmprestimo.getEmprestimoById(idEmprestimo); // Chama a função do modelo para obter o empréstimo pelo ID
        
        // Verifica se o empréstimo foi encontrado
        if(!emprestimo){
            return res.status(404).json({ error: 'Empréstimo não encontrado' });
        }
        // Retorna o empréstimo encontrado como resposta JSON
        res.json({status: "ok", registro: emprestimo});
    }
    catch(error){
        console.error("Erro no getEmprestimoById: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar empréstimo no servidor." });
    }
}

//Função para inserir um novo empréstimo
const insertEmprestimo = async (req, res) => {
    try{
        const dadosEmprestimo = req.body;
        const {id_livro, id_leitor, data_vencimento} = dadosEmprestimo;

        // Validação básica dos dados recebidos
        if(!id_livro || !id_leitor || !data_vencimento){
            return res.status(400).json({ status: "error", mensagem: "Dados incompletos para inserir o empréstimo." });
        }

        const novoEmprestimo = await mdlEmprestimo.insertEmprestimo(dadosEmprestimo); // Chama a função do modelo para inserir o empréstimo
        res.json({ status: "ok", mensagem: "Empréstimo inserido com sucesso", registro: novoEmprestimo }); // Retorna o novo empréstimo como resposta JSON
    }
    catch(error){
        console.error("Erro no insertEmprestimo: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao inserir empréstimo no servidor." });
    }
}

//Função para atualizar um empréstimo existente
const updateEmprestimo = async (req, res) => {
    try{
        const idEmprestimo = parseInt(req.params.id); // Obtém o ID do empréstimo dos parâmetros da rota
        const dadosEmprestimo = req.body;
        
        if(idEmprestimo <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do empréstimo inválido." });
        }
        if(Object.keys(dadosEmprestimo).length === 0){
            return res.status(400).json({ status: "error", mensagem: "Nenhum dado fornecido para atualização." });
        }

        const emprestimoAtualizado = await mdlEmprestimo.updateEmprestimo(idEmprestimo, dadosEmprestimo); // Chama a função do modelo para atualizar o empréstimo

        if(!emprestimoAtualizado){
            return res.status(404).json({ status: "error", mensagem: "Empréstimo não encontrado." });
        }
        res.json({ status: "ok", mensagem: "Empréstimo atualizado com sucesso", registro: emprestimoAtualizado });
    }
    catch(error){
        console.error("Erro no updateEmprestimo: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao atualizar empréstimo no servidor." });
    }
}

//Função para soft delete de um empréstimo
const deleteEmprestimo = async (req, res) => {
    try{
        const idEmprestimo = parseInt(req.params.id); // Obtém o ID do empréstimo dos parâmetros da rota

        if(idEmprestimo <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do empréstimo inválido." });
        }

        const rowCount = await mdlEmprestimo.deleteEmprestimo(idEmprestimo); // Chama a função do modelo para deletar o empréstimo

        if(rowCount === 0){
            return res.status(404).json({ status: "error", mensagem: "Empréstimo não encontrado ou já foi removido." });
        }

        res.status(204).send(); // Retorna status 204 No Content para indicar sucesso sem corpo de resposta
            
    }
    catch(error){
        console.error("Erro no deleteEmprestimo: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao deletar empréstimo no servidor." });
    }
}

//Exportação das funções
module.exports = {
    getAllEmprestimo,
    getEmprestimoById,
    insertEmprestimo,
    updateEmprestimo,
    deleteEmprestimo
}