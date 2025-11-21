const mdlLeitor = require("../model/mdlLeitor");

const getAllLeitor = async (req, res) => {
    try {
        const leitor = await mdlLeitor.getAllLeitor();

        res.json({ status: "ok", registros: leitor });
    }
    catch (error) {
        console.error("Erro no getAllLeitor: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar leitores no servidor." })

    }
}

const getLeitorById = async (req, res) => {
    try {
        const idLeitor = parseInt(req.body.id);

        if (isNaN(idLeitor) || idLeitor <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID inválido." });
        }

        const leitor = await mdlLeitor.getLeitorById(idLeitor);

        if (!leitor) {
            return res.status(404).json({ error: 'Leitor não encontrado' });
        }

        res.json({ status: "ok", registro: leitor });
    }
    catch (error) {
        console.error("Erro no getLeitorById: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar leitor no servidor." })
    }
}

const insertLeitor = async (req, res) => {
    try {
        const dadosLeitor = req.body;
        const { nome, email, cpf, data_nascimento } = dadosLeitor;

        if (!nome || !email || !cpf || !data_nascimento) {
            return res.status(400).json({ status: "error", mensagem: "Preencha todos os campos obrigatórios." });
        }
        const novoLeitor = await mdlLeitor.insertLeitor(dadosLeitor);
        res.status(201).json({ status: "ok", mensagem: "Leitor inserido com sucesso", registro: novoLeitor });
    }
    catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                status: "error",
                mensagem: "Já existe um leitor cadastrado com esse CPF ou Email."
            });
        }

        console.error("Erro no insertLeitor: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao inserir leitor no servidor." })
    }
}

const updateLeitor = async (req, res) => {
    try {
        const idLeitor = parseInt(req.body.id);
        const dadosLeitor = req.body;

        if (isNaN(idLeitor) || idLeitor <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID do leitor inválido." });
        }

        const { id, ...dadosParaAtualizar } = dadosLeitor;

        if (Object.keys(dadosParaAtualizar).length === 0) {
            return res.status(400).json({ status: "error", mensagem: "Nenhum dado fornecido para atualização." });
        }

        const leitorAtualizado = await mdlLeitor.updateLeitor(idLeitor, dadosParaAtualizar);

        if (!leitorAtualizado) {
            return res.status(404).json({ status: "error", mensagem: "Leitor não encontrado." });
        }
        res.json({ status: "ok", mensagem: "Leitor atualizado com sucesso", registro: leitorAtualizado });
    }
    catch (error) {
        console.error("Erro no updateLeitor: ", error);
        if (error.code === '23505') {
            return res.status(409).json({ status: "error", mensagem: "Já existe um leitor com esse nome." });
        }
        res.status(500).json({ status: "error", mensagem: "Erro ao atualizar leitor no servidor." })
    }
}

const deleteLeitor = async (req, res) => {
    try {
        const idLeitor = parseInt(req.body.id);

        if (isNaN(idLeitor) || idLeitor <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID do leitor inválido." });
        }

        const leitorDeletado = await mdlLeitor.deleteLeitor(idLeitor);

        if (!leitorDeletado) {
            return res.status(404).json({ status: "error", mensagem: "Leitor não encontrado." });
        }

        res.json({ status: "ok", mensagem: "Leitor deletado com sucesso", registro: leitorDeletado });
    }
    catch (error) {
        console.error("Erro no deleteLeitor: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao deletar leitor no servidor." })
    }
}

module.exports = {
    getAllLeitor,
    getLeitorById,
    insertLeitor,
    updateLeitor,
    deleteLeitor
}