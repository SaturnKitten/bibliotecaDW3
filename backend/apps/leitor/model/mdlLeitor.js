const db = require("../../../database/databaseconfig");

// Função para obter todos os leitores (não removidos)
const getAllLeitor = async () => {
    const { rows } = await db.query("SELECT id, nome, email FROM leitor WHERE removido = false ORDER BY id ASC");
    return rows;
}

// Função para obter um leitor por ID (não removido)
const getLeitorById = async (idLeitorPar) => {
    const { rows } = await db.query("SELECT id, nome, email FROM leitor WHERE id = $1 AND removido = false", [idLeitorPar]);
    return rows[0];
}

// Função para inserir um novo leitor
const insertLeitor = async (dadosLeitor) => {
    const { nome, email, cpf, data_nascimento } = dadosLeitor;

    const query = `INSERT INTO leitor (nome, email, cpf, data_nascimento)
        VALUES ($1, $2, $3, $4)
        RETURNING id, nome, email;`;

    const values = [nome, email, cpf, data_nascimento];
    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para atualizar um leitor existente
const updateLeitor = async (idLeitorPar, dadosLeitor) => {
    const { nome, email, cpf, data_nascimento } = dadosLeitor;

    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    if (nome !== undefined) {
        setClauses.push(`nome = $${paramIndex++}`);
        values.push(nome);
    }
    if (email !== undefined) {
        setClauses.push(`email = $${paramIndex++}`);
        values.push(email);
    }
    if (cpf !== undefined) {
        setClauses.push(`cpf = $${paramIndex++}`);
        values.push(cpf);
    }
    if (data_nascimento !== undefined) {
        setClauses.push(`data_nascimento = $${paramIndex++}`);
        values.push(data_nascimento);
    }

    if (setClauses.length === 0) {
        // Nenhum campo para atualizar
        return null;
    }

    values.push(idLeitorPar);
    const idIndex = paramIndex;

    const query = `UPDATE leitor
        SET ${setClauses.join(", ")}
        WHERE id = $${idIndex}
        AND removido = false
        RETURNING id, nome, email`;

    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para soft delete de um leitor
const deleteLeitor = async (idLeitorPar) => {
    const query = `UPDATE leitor
        SET removido = true
        WHERE id = $1
        RETURNING id, nome, email;`;

    const values = [idLeitorPar];
    const { rows } = await db.query(query, values);
    return rows[0];
}

module.exports = {
    getAllLeitor,
    getLeitorById,
    insertLeitor,
    updateLeitor,
    deleteLeitor
}