--- Banco de Dados bibliotecaDW3.sql ---
CREATE DATABASE bibliotecaDW3;

-- Criar extensão para criptografia de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Cria tabela de gêneros literários
CREATE TABLE IF NOT EXISTS genero(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Cria tabela de livros
CREATE TABLE IF NOT EXISTS livro(
    id SERIAL PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    autor VARCHAR(255) NOT NULL,
    editora VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) UNIQUE,
    edicao VARCHAR(50) NOT NULL,
    ano_publicacao INT NOT NULL,
    id_genero INT NOT NULL REFERENCES genero(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Cria tabela de leitores
CREATE TABLE IF NOT EXISTS leitor(
    id SERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Cria tabela de empréstimos (relaciona livros e leitores)
CREATE TABLE IF NOT EXISTS emprestimo(
    id SERIAL PRIMARY KEY,
    id_livro INT NOT NULL REFERENCES livro(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    id_leitor INT NOT NULL REFERENCES leitor(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_vencimento DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Pendente',
    multa_atraso DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

-- Cria tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionario(
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    removido BOOLEAN NOT NULL DEFAULT FALSE
);

--- Inserir dados iniciais nas tabelas ---

-- Inserir gêneros na tabela genero
INSERT INTO genero (nome) VALUES
('Ficção'),
('Não-Ficção'),
('Romance'),
('Fantasia'),
('Ciência'),
('História');

-- Inserir livros na tabela livro
INSERT INTO livro (titulo, autor, editora, isbn, edicao, ano_publicacao, id_genero) VALUES
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'HarperCollins', '9780261102385', '1ª', 1954, 4),
('1984', 'George Orwell', 'Secker & Warburg', '9780451524935', '1ª', 1949, 1),
('A Brief History of Time', 'Stephen Hawking', 'Bantam Books', '9780553380163', '1ª', 1988, 5);

-- Inserir leitores na tabela leitor
INSERT INTO leitor (nome, email, cpf, data_nascimento) VALUES
('Ana Silva', 'ana.silva@example.com', '123.456.789-00', '1990-01-01'),
('Bruno Souza', 'bruno.souza@example.com', '987.654.321-00', '1985-05-15');

/* Inserir funcionários na tabela funcionario*/

-- Insere o Administrador Principal
INSERT INTO funcionario (nome, username, password, email) VALUES
('admin', 'admin', crypt('admin', gen_salt('bf')), 'admin@admin.com')
ON CONFLICT DO NOTHING;

-- Insere um Funcionário que será removido (para testar o filtro getAllFuncionario)
INSERT INTO funcionario (nome, username, password, email, removido)
VALUES ('Joaquim da Silva', 'joaquims', 'silva123', 'joaquim@biblioteca.org', TRUE);

--- Comandos para testes ---
/* Deleta as tabelas criadas
DROP TABLE IF EXISTS emprestimo, livro, leitor, genero, funcionario CASCADE;
*/

-- Exibir todos os gêneros
SELECT nome FROM genero;

-- Exibir todos os livros
SELECT * FROM livro;

--- Exibir livros com seus respectivos gêneros, sem mostrar o id do gênero, id do livro e campo removido
SELECT l.titulo, l.autor, l.editora, l.edicao, l.ano_publicacao, g.nome as genero FROM livro l INNER JOIN genero g ON l.id_genero = g.id;

-- Exibir todos os leitores
SELECT * FROM leitor;

-- Exibir todos os funcionários
SELECT * FROM funcionario;