const db = require("../../../database/databaseconfig");

const getCredencial = async (loginPar) => {
  return (
    await db.query(
      'select username, password ' +
        'from funcionario where username = $1 and removido = false',
      [loginPar]
    )
  ).rows;
};

module.exports = {
  getCredencial,
};