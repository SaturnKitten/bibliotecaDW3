const db = require("../../../database/databaseconfig");
const bcrypt = require('bcryptjs');

const getAllGenero = async () => {};

const getGeneroById = async (idGeneroPar) => {};

const insertGenero = async (dadosGenero) => {};

const updateGenero = async (idGeneroPar, dadosGenero) => {};

const deleteGenero = async (idGeneroPar) => {};

module.exports = {
    getAllGenero,
    getGeneroById,
    insertGenero,
    updateGenero,
    deleteGenero
}