const validate = require("validate.js");

const constraints = {
  username: {
    presence: {
      allowEmpty: false,
      message: "^O campo usuário é obrigatório."
    },
    length: {
      minimum: 1,
      message: "^O campo usuário é obrigatório."
    }
  },

  password: {
    presence: {
      allowEmpty: false,
      message: "^O campo senha é obrigatório."
    },
    length: {
      minimum: 1,
      message: "^O campo senha é obrigatório."
    }
  }
};


function Validar(formData) {
  // validate.js retorna "undefined" quando NÃO há erro
  const errors = validate(formData, constraints);

  if (errors) {
    return false;
  }

  return true;
}

module.exports = {
  constraints,
  Validar
};
