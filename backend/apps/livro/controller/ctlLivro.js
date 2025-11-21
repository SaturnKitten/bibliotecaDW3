const mdlLivro = require("../model/mdlLivro");

const getAllLivro = async (req, res) => {
    try {
        const livros = await mdlLivro.getAllLivro();
        res.json({ status: "ok", registros: livros });
    }
    catch (error) {
        console.error("Erro no getAllLivro: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar livros no servidor." });
    }
}

const getLivroById = async (req, res) => {
    try {
        const idLivro = parseInt(req.body.id);

        if (isNaN(idLivro) || idLivro <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID do livro inválido." });
        }

        const livro = await mdlLivro.getLivroById(idLivro);

        if (!livro) {
            return res.status(404).json({ status: "error", mensagem: "Livro não encontrado." });
        }

        res.json({ status: "ok", registro: livro });
    }
    catch (error) {
        console.error("Erro no getLivroById: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao buscar livro no servidor." });
    }
}

const insertLivro = async (req, res) => {
    try {
        const dadosLivro = req.body;
        const { titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero } = dadosLivro;

        // Validação de todos os campos obrigatórios (NOT NULL)
        if (!titulo || !autor || !editora || !edicao || !ano_publicacao || !id_genero) {
            return res.status(400).json({ status: "error", mensagem: "Preencha todos os campos obrigatórios." });
        }

        const novoLivro = await mdlLivro.insertLivro(dadosLivro);

        res.status(201).json({ status: "ok", mensagem: "Livro inserido com sucesso", registro: novoLivro });
    }
    catch (error) {
        console.error("Erro no insertLivro: ", error);

        // Erro 23505: Violação de UNIQUE (ISBN duplicado)
        if (error.code === '23505') {
            return res.status(409).json({ status: "error", mensagem: "Já existe um livro cadastrado com esse ISBN." });
        }
        
        // Erro 23503: Violação de FOREIGN KEY (Gênero não existe)
        if (error.code === '23503') {
            return res.status(400).json({ status: "error", mensagem: "O ID do Gênero informado não existe." });
        }

        res.status(500).json({ status: "error", mensagem: "Erro ao inserir livro no servidor." });
    }
}

const updateLivro = async (req, res) => {
    try {
        const idLivro = parseInt(req.body.id);
        const dadosLivro = req.body;

        if (isNaN(idLivro) || idLivro <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID do livro inválido." });
        }

        const { id, ...dadosParaAtualizar } = dadosLivro;

        if (Object.keys(dadosParaAtualizar).length === 0) {
            return res.status(400).json({ status: "error", mensagem: "Nenhum dado fornecido para atualização." });
        }

        const livroAtualizado = await mdlLivro.updateLivro(idLivro, dadosParaAtualizar);

        if (!livroAtualizado) {
            return res.status(404).json({ status: "error", mensagem: "Livro não encontrado." });
        }

        res.json({ status: "ok", mensagem: "Livro atualizado com sucesso", registro: livroAtualizado });
    }
    catch (error) {
console.error("Erro no updateLivro: ", error);

        // Erro 23505: Violação de UNIQUE (ISBN duplicado)
        if (error.code === '23505') {
            return res.status(409).json({ status: "error", mensagem: "Este ISBN já pertence a outro livro." });
        }
        // Erro 23503: Violação de FOREIGN KEY (Gênero não existe)
        if (error.code === '23503') {
            return res.status(400).json({ status: "error", mensagem: "O ID do Gênero informado não existe." });
        }

        res.status(500).json({ status: "error", mensagem: "Erro ao atualizar livro no servidor." });
    }
}

const deleteLivro = async (req, res) => {
    try {
        const idLivro = parseInt(req.body.id);

        if (isNaN(idLivro) || idLivro <= 0) {
            return res.status(400).json({ status: "error", mensagem: "ID do livro inválido." });
        }

        const livroDeletado = await mdlLivro.deleteLivro(idLivro);

        if (!livroDeletado) {
            return res.status(404).json({ status: "error", mensagem: "Livro não encontrado ou já removido." });
        }

        res.json({ status: "ok", mensagem: "Livro deletado com sucesso", registro: livroDeletado });
    }
    catch (error) {
        console.error("Erro no deleteLivro: ", error);
        res.status(500).json({ status: "error", mensagem: "Erro ao deletar livro no servidor." });
    }
}

module.exports = {
    getAllLivro,
    getLivroById,
    insertLivro,
    updateLivro,
    deleteLivro
}