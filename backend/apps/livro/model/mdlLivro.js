const db = require("../../../database/databaseconfig");

// Função para obter todos os livros (não removidos) ordenados por autor
const getAllLivro = async () => {
    const { rows } = await db.query(`SELECT li.id, li.titulo, li.autor, li.editora, li.isbn, li.edicao, li.ano_publicacao, g.nome as genero
        FROM livro li
        INNER JOIN genero g
        ON li.id_genero = g.id
        WHERE li.removido = false
        ORDER BY li.autor ASC`);
    return rows;
}

// Função para obter um livro por ID (não removido)
const getLivroById = async (idLivroPar) => {
    const { rows } = await db.query(`SELECT li.id, li.titulo, li.autor, li.editora, li.isbn, li.edicao, li.ano_publicacao, g.nome as genero
        FROM livro li
        INNER JOIN genero g
        ON li.id_genero = g.id
        WHERE li.id = $1 AND li.removido = false`, 
        [idLivroPar]
    );
    return rows[0];
}

// Função para inserir um novo livro
const insertLivro = async (dadosLivro) => {
    const { titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero } = dadosLivro;

    const query = `INSERT INTO livro 
        (titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, titulo, isbn;`;

    const values = [titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero];
    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para atualizar um livro existente
const updateLivro = async (idLivroPar, dadosLivro) => {
    const { titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero } = dadosLivro;
    
    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    if (titulo !== undefined) {
        setClauses.push(`titulo = $${paramIndex++}`);
        values.push(titulo);
    }
    if (autor !== undefined) {
        setClauses.push(`autor = $${paramIndex++}`);
        values.push(autor);
    }
    if (editora !== undefined) {
        setClauses.push(`editora = $${paramIndex++}`);
        values.push(editora);
    }
    if (isbn !== undefined) {
        setClauses.push(`isbn = $${paramIndex++}`);
        values.push(isbn);
    }
    if (edicao !== undefined) {
        setClauses.push(`edicao = $${paramIndex++}`);
        values.push(edicao);
    }
    if (ano_publicacao !== undefined) {
        setClauses.push(`ano_publicacao = $${paramIndex++}`);
        values.push(ano_publicacao);
    }
    if (id_genero !== undefined) {
        setClauses.push(`id_genero = $${paramIndex++}`);
        values.push(id_genero);
    }

    if (setClauses.length === 0) {
        return null;
    }

    values.push(idLivroPar);
    const idIndex = paramIndex;

    const query = `UPDATE livro 
        SET ${setClauses.join(', ')}
        WHERE id = $${idIndex} AND removido = false
        RETURNING id, titulo, isbn;`;

    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para soft delete de um livro
const deleteLivro = async (idLivroPar) => {
    const query = `UPDATE livro
        SET removido = true
        WHERE id = $1
        RETURNING id, titulo;`;

    const values = [idLivroPar];
    const { rows } = await db.query(query, values);
    return rows[0];
}

module.exports = {
    getAllLivro,
    getLivroById,
    insertLivro,
    updateLivro,
    deleteLivro
}