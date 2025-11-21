const db = require("../../../database/databaseconfig");
const bcrypt = require('bcryptjs');

// Função para obter todos os funcionários (não removidos)
const getAllFuncionario = async () => {
    const{ rows } = await db.query("SELECT id, nome, username, email FROM funcionario WHERE removido = false ORDER BY id ASC");
    return rows;
}

// Função para obter um funcionário por ID (não removido)
const getFuncionarioById = async (idFuncionarioPar) => {
    const { rows } = await db.query("SELECT id, nome, username, email FROM funcionario WHERE id = $1 AND removido = false", [idFuncionarioPar]);
    return rows[0];
}

// Função para inserir um novo funcionário
const insertFuncionario = async (dadosFuncionario) => {
    const { nome, username, email, senha } = dadosFuncionario;
    
    // Hash da senha antes de salvar
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    const query = `INSERT INTO funcionario (nome, username, email, senha)
    VALUES ($1, $2, $3, $4) RETURNING id, nome, username, email;`;

    const values = [nome, username, email, senhaHash];
    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para atualizar um funcionário existente
const updateFuncionario = async (idFuncionarioPar, dadosFuncionario) => {
    const { nome, username, email, senha } = dadosFuncionario;
    
    let setClauses = [];
    let values = [];
    let paramIndex = 1;

    if (nome !== undefined) {
        setClauses.push(`nome = $${paramIndex++}`);
        values.push(nome);
    }
    if (username !== undefined) {
        setClauses.push(`username = $${paramIndex++}`);
        values.push(username);
    }
    if (email !== undefined) {
        setClauses.push(`email = $${paramIndex++}`);
        values.push(email);
    }
    if (senha !== undefined) {
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senha, saltRounds);
        setClauses.push(`senha = $${paramIndex++}`);
        values.push(senhaHash);
    }
    if (setClauses.length === 0) {
        return null;
    }

    values.push(idFuncionarioPar);
    const idIndex = paramIndex;

    const query = `UPDATE funcionario 
    SET ${setClauses.join(', ')}
    WHERE id = $${idIndex} AND removido = false
    RETURNING id, nome, username, email;`;

    const { rows } = await db.query(query, values);
    return rows[0];
}

// Função para soft delete de um funcionário
const deleteFuncionario = async (idFuncionarioPar) => {
    const query = `UPDATE funcionario SET removido = true WHERE id = $1 RETURNING id, nome, username, email;`;
    const values = [idFuncionarioPar];
    const { rows } = await db.query(query, values);
    return rows[0];
}

//Exportação das funções
module.exports = {
    getAllFuncionario,
    getFuncionarioById,
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario
}