const mdlGenero = require("../model/mdlGenero");

const getAllGenero = async (req, res) => {
    try{
        const genero = await mdlGenero.getAllGenero();

        res.json({status: "ok", registros: genero});
    }
    catch (error) {
        console.error("Erro no getAllGenero: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar gêneros no servidor." })

    }
}

const getGeneroById = async (req, res) => {
    try{
        const idGenero = parseInt(req.body.id);

        if (isNaN(idGenero) || idGenero <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID inválido." });
        }

        const genero = await mdlGenero.getGeneroById(idGenero);

        if(!genero){
            return res.status(404).json({ error: 'Gênero não encontrado' });
        }
        
        res.json({status: "ok", registro: genero});
    }
    catch (error) {
        console.error("Erro no getGeneroById: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar gênero no servidor." })
    }
}

const insertGenero = async (req, res) => {
    try{
        const dadosGenero = req.body;
        const { nome } = dadosGenero;

        if (!nome) {
            return res.status(400).json({ status: "error", mensagem: "O nome do gênero é obrigatório." });
        }

        const novoGenero = await mdlGenero.insertGenero(dadosGenero);
        res.status(201).json({ status: "ok", mensagem: "Gênero inserido com sucesso", registro: novoGenero });
    }
    catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ 
                status: "error", 
                mensagem: "Já existe um gênero cadastrado com esse nome." 
            });
        }

        console.error("Erro no insertGenero: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao inserir gênero no servidor." })
    }
}

const updateGenero = async (req, res) => {
    try{
        const idGenero = parseInt(req.body.id);
        const dadosGenero = req.body;

        if(isNaN(idGenero) ||idGenero <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do gênero inválido." });
        }

        if (Object.keys(dadosGenero).length === 0) {
            return res.status(400).json({ status: "error", mensagem: "Nenhum dado fornecido para atualização." });
        }
        const generoAtualizado = await mdlGenero.updateGenero(idGenero, dadosGenero);

        if (!generoAtualizado) {
            return res.status(404).json({ status: "error", mensagem: "Gênero não encontrado." });
        }
        res.json({ status: "ok", mensagem: "Gênero atualizado com sucesso", registro: generoAtualizado });

    }
    catch (error) {
        console.error("Erro no updateGenero: ", error);
        if (error.code === '23505') {
             return res.status(409).json({ status: "error", mensagem: "Já existe um gênero com esse nome." });
        }
        res.status(500).json({ status: "error", mensagem: "Erro ao atualizar gênero no servidor." })
    }
}
    
const deleteGenero = async (req, res) => {
    try{
        const idGenero = parseInt(req.body.id);
        
        if(isNaN(idGenero) || idGenero <= 0){
            return res.status(400).json({ status: "error", mensagem: "ID do gênero inválido." });
        }
        
        const generoDeletado = await mdlGenero.deleteGenero(idGenero);

        if (!generoDeletado) {
            return res.status(404).json({ status: "error", mensagem: "Gênero não encontrado." });
        }

        res.json({ status: "ok", mensagem: "Gênero deletado com sucesso", registro: generoDeletado });
    }
    catch (error) {
        console.error("Erro no deleteGenero: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao deletar gênero no servidor." })
    }
}

module.exports = {
    getAllGenero,
    getGeneroById,
    insertGenero,
    updateGenero,
    deleteGenero
}