const db = require('../../../database/databaseconfig.js');

//Função para obter todos os empréstimos (não removidos)
const getAllEmprestimo = async () => {
    const query =`SELECT
            e.id, e.data_emprestimo, e.data_vencimento, e.status, e.multa_atraso,
            li.titulo AS livro,
            le.nome AS leitor, le.cpf
            FROM emprestimo e
            INNER JOIN livro li
            ON e.id_livro = li.id
            INNER JOIN leitor le
            ON e.id_leitor = le.id
            WHERE e.removido = FALSE
            ORDER BY e.id DESC;`;

    const result = await db.query(query);
    return result.rows;
}

//Função para obter um empréstimo pelo ID (não removido)
const getEmprestimoById = async (idEmprestimoPar) => {
    const query = `SELECT 
            e.id, e.data_emprestimo, e.data_vencimento, e.status, e.multa_atraso,
            li.titulo AS livro, le.nome AS leitor, le.cpf 
            FROM emprestimo e 
            INNER JOIN livro li
            ON e.id_livro = li.id 
            INNER JOIN leitor le
            ON e.id_leitor = le.id 
            WHERE e.removido = FALSE 
            AND e.id = $1;`;
    
    const values = [idEmprestimoPar];
    const result = await db.query(query, values);
    return result.rows[0];
}

//Função para inserir um novo empréstimo
const insertEmprestimo = async (dadosEmprestimo) => {
    const {id_livro, id_leitor, data_vencimento} = dadosEmprestimo;  
    // Inserção do novo empréstimo no banco de dados
    const query = `INSERT INTO emprestimo
        (id_livro, id_leitor, data_vencimento)
        VALUES ($1, $2, $3) 
        RETURNING *;`;
    const values = [id_livro, id_leitor, data_vencimento];
    const result = await db.query(query, values);
    return result.rows[0];
}

//Função para atualizar um empréstimo existente
const updateEmprestimo = async (emprestimoIDPar, dadosEmprestimo) => {
    const { 
        id_livro, 
        id_leitor, 
        data_emprestimo, 
        data_vencimento, 
        status, 
        multa_atraso 
    } = dadosEmprestimo; // Desestruturação dos dados do empréstimo
    let setClauses = []; // Array que armazenará as partes do SQL: ['status = $1', 'multa_atraso = $2']
    let values = []; // Array que armazenará os valores que irão substituir os $ marcadores: ['devolvido', 5.00]
    let paramIndex = 1; // Inicia o contador para os marcadores ($1, $2, $3...)
    
    // CONSTRUÇÃO DINÂMICA DA CLÁUSULA SET
    // Para cada campo, verifica se ele foi enviado (se é !== undefined).
    // Se foi enviado, ele é adicionado à lista de atualização e seu valor é adicionado ao array 'values'.
    // Isso é crucial para evitar erros de NOT NULL no BD (evita que um campo que não foi enviado seja definido como NULL).
    if (id_livro !== undefined) {
        setClauses.push(`id_livro = $${paramIndex++}`);
        values.push(id_livro);
    }
    if (id_leitor !== undefined) {
        setClauses.push(`id_leitor = $${paramIndex++}`);
        values.push(id_leitor);
    }
    if (data_emprestimo !== undefined) {
        setClauses.push(`data_emprestimo = $${paramIndex++}`);
        values.push(data_emprestimo);
    }
    if (data_vencimento !== undefined) {
        setClauses.push(`data_vencimento = $${paramIndex++}`);
        values.push(data_vencimento);
    }
    if (status !== undefined) {
        setClauses.push(`status = $${paramIndex++}`);
        values.push(status);
    }
    if (multa_atraso !== undefined) {
        setClauses.push(`multa_atraso = $${paramIndex++}`);
        values.push(multa_atraso);
    }
    
    // Verifica se há algo para atualizar
    if (setClauses.length === 0) {
        return null; // Retorna null se o corpo da requisição estiver vazio
    }
    
    // Adiciona o ID de busca ao final da lista de valores.
    // Ele será usado na cláusula WHERE e será sempre o último marcador ($N).
    values.push(emprestimoIDPar); 
    const idIndex = paramIndex; 

    // Constrói a query final. setClauses.join(', ') insere vírgulas entre as partes do SET
    const query = `UPDATE emprestimo 
        SET ${setClauses.join(', ')} 
        WHERE id = $${idIndex} AND removido = FALSE
        RETURNING *;`;
        
    // Executa a query com os valores parametrizados
    const result = await db.query(query, values);

    // Retorna o objeto do empréstimo atualizado ou undefined se não encontrou o ID.
    return result.rows[0];
}

//Função para soft delete de um empréstimo
const deleteEmprestimo = async (emprestimoIDPar) => {
    const query = `UPDATE emprestimo 
        SET removido = TRUE 
        WHERE id = $1 AND removido = FALSE
        RETURNING *;`;
    
    const result = await db.query(query, [emprestimoIDPar]);
    return result.rowCount;
}

//Exportação das funções
module.exports = {
    getAllEmprestimo,
    getEmprestimoById,
    insertEmprestimo,
    updateEmprestimo,
    deleteEmprestimo
}