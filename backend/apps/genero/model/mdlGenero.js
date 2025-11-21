const db = require("../../../database/databaseconfig");

// Função para obter todos os gêneros (não removidos)
const getAllGenero = async () => {
    const{ rows } = await db.query("SELECT id, nome FROM genero WHERE removido = false ORDER BY id ASC");
    return rows;
};

// Função para obter um gênero por ID (não removido)
const getGeneroById = async (idGeneroPar) => {
    const { rows } = await db.query(`SELECT id, nome FROM genero
        WHERE id = $1
        AND removido = false`, [idGeneroPar]);
    return rows[0];
};

// Função para inserir um novo gênero
const insertGenero = async (dadosGenero) => {
    const { nome } = dadosGenero;

    const query = `INSERT INTO genero (nome)
        VALUES ($1)
        RETURNING id, nome`;

    const values = [nome];
    const { rows } = await db.query(query, values);
    return rows[0];
};

// Função para atualizar um gênero existente
const updateGenero = async (idGeneroPar, dadosGenero) => {
    const { nome } = dadosGenero;
    
    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    if (nome !== undefined) {
        setClauses.push(`nome = $${paramIndex++}`);
        values.push(nome);
    }
    if (setClauses.length === 0) {
        return null;
    }

    values.push(idGeneroPar);
    const idIndex = paramIndex;

    const query = `UPDATE genero 
        SET ${setClauses.join(', ')}
        WHERE id = $${idIndex}
        AND removido = false
        RETURNING id, nome;`;

    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para soft delete de um gênero
const deleteGenero = async (idGeneroPar) => {
    const query = `UPDATE genero
        SET removido = true
        WHERE id = $1
        RETURNING id, nome;`;

    const values = [idGeneroPar];
    const { rows } = await db.query(query, values);
    return rows[0];
};

module.exports = {
    getAllGenero,
    getGeneroById,
    insertGenero,
    updateGenero,
    deleteGenero
}