const mdlFuncionario = require("../model/mdlFuncionario");

const getAllFuncionario = async (req, res) => {
    try {
        const funcionario = await mdlFuncionario.getAllFuncionario();

        res.json({status: "ok", registros: funcionario});
    }
    catch (error) {
        console.error("Erro no getAllFuncionario: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar funcionários no servidor." })
    }
}

const getFuncionarioById = async (req, res) => {
    try {
        const idFuncionario = parseInt(req.body.id);

        if(isNaN(idFuncionario) || idFuncionario <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID inválido." });
        }

        const funcionario = await mdlFuncionario.getFuncionarioById(idFuncionario);

        if(!funcionario){
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.json({status: "ok", registro: funcionario});
    }
    catch (error) {
        console.error("Erro no getFuncionarioById: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar funcionário no servidor." })
    }
}

const insertFuncionario = async (req, res) => {
    try {
        const dadosFuncionario = req.body;
        const { nome, username, email, password } = dadosFuncionario;

        if(!nome || !username || !email || !password){
            return res.status(400).json({ status: "error", mensagem: "Dados incompletos para inserir o funcionário." });
        }
        
        const novoFuncionario = await mdlFuncionario.insertFuncionario(dadosFuncionario);
        
        res.status(201).json({status: "ok", mensagem: "Funcionário inserido com sucesso", registro: novoFuncionario});
    }
    catch (error) {
        console.error("Erro no insertFuncionario: ", error);

        // Tratamento de erro para conflito de username ou email
        if (error.code === '23505') {
            return res.status(409).json({ status: "error", mensagem: "Username ou Email já cadastrado no sistema." });
        }
        // Erro genérico
        res.status(500).json({ status: "error", mensagem: "Erro ao inserir funcionário no servidor." })
    }
}

const updateFuncionario = async (req, res) => {
    try {
        const idFuncionario = parseInt(req.body.id);
        const dadosFuncionario = req.body;

        if(isNaN(idFuncionario) || idFuncionario <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do funcionário inválido." });
        }

        const { id, ...dadosParaAtualizar } = dadosFuncionario;

        if(Object.keys(dadosParaAtualizar).length === 0){
            return res.status(400).json({ status: "error", mensagem: "Nenhum dado fornecido para atualização." });
        }

        const funcionarioAtualizado = await mdlFuncionario.updateFuncionario(idFuncionario, dadosParaAtualizar);
        
        if(!funcionarioAtualizado){
            return res.status(404).json({ status: "error", mensagem: "Funcionário não encontrado." });
        }
        res.json({status: "ok", registro: funcionarioAtualizado});
    }
    catch (error) {
        console.error("Erro no updateFuncionario: ", error);

        if (error.code === '23505') {
            return res.status(409).json({ status: "error", mensagem: "Username ou Email já cadastrado no sistema." });
        }

        res.status(500).json({ status: "error", mensagem: "Erro ao atualizar funcionário no servidor." })
    }
}
const deleteFuncionario = async (req, res) => {
    try {
        const idFuncionario = parseInt(req.body.id);

        if(isNaN(idFuncionario) || idFuncionario <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do funcionário inválido." });
        }
        
        const funcionarioRemovido = await mdlFuncionario.deleteFuncionario(idFuncionario); // Chama a função do modelo para deletar o funcionário
        
        if(!funcionarioRemovido){
            return res.status(404).json({ status: "error", mensagem: "Funcionário não encontrado ou já foi removido." });
        }
        
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro no deleteFuncionario: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao deletar funcionário no servidor." })
    }
}

module.exports = {
    getAllFuncionario,
    getFuncionarioById,
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario
}