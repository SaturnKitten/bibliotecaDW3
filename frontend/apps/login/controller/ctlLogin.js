const axios = require("axios");
const validate = require("../validate/vldLogin"); // valida username e password

// ----------------------------------------------------------------------
// LOGIN
// ----------------------------------------------------------------------
const Login = async (req, res) => {
  let remoteMSG = "sem mais informações";

  if (req.method === "POST") {
    const formData = req.body;

    // -------------------------------
    // 1) Validação de entrada
    // -------------------------------
    if (!validate.Validar(formData)) {
      return res.status(400).json({
        status: "error",
        msg: "Dados de entrada inválidos."
      });
    }

    // -------------------------------
    // 2) Enviar login ao servidor Back
    // -------------------------------
    let resp;
    try {

      resp = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/login",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 2000
        }
      );

    } catch (error) {

      // servidor offline
      if (error.code === "ECONNREFUSED") {
        remoteMSG = "Servidor indisponível.";
        return res.status(503).json({
          status: "error",
          msg: "Erro ao fazer login: " + remoteMSG
        });
      }

      // usuário não autenticado
      if (error.response && error.response.status === 401) {
        remoteMSG = "Usuário ou senha inválidos.";
        return res.status(401).json({
          status: "error",
          msg: remoteMSG
        });
      }

      // erro genérico
      remoteMSG = error.message;
      return res.status(400).json({
        status: "error",
        msg: "Erro ao fazer login: " + remoteMSG
      });
    }

    // -------------------------------
    // 3) Verificar retorno
    // -------------------------------
    if (!resp || !resp.data || !resp.data.token) {
      return res.status(400).json({
        status: "error",
        msg: "Retorno inesperado do servidor."
      });
    }

    // -------------------------------
    // 4) Armazenar sessão do usuário
    // -------------------------------
    const session = req.session;
    session.isLogged = true;
    session.userName = resp.data.username;
    session.token = resp.data.token;
    session.tokenRefresh = resp.data.tokenRefresh;
    session.tempoInativoMaximoFront = process.env.tempoInativoMaximoFront;

    res.cookie(
      "tempoInativoMaximoFront",
      process.env.tempoInativoMaximoFront,
      { sameSite: "strict" }
    );

    return res.json({ status: "ok", msg: "Login efetuado com sucesso!" });

  } else {
    // -------------------------------
    // GET – Mostrar página de login
    // -------------------------------
    const parametros = {
      title: "Biblioteca - Login",
      constraint: JSON.stringify(validate.constraints)
    };
    res.render("login/view/vwLogin.njk", parametros);
  }
};

// ----------------------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------------------
function Logout(req, res) {
  const session = req.session;

  session.isLogged = false;
  session.token = null;
  session.tokenRefresh = null;
  session.tempoInativoMaximoFront = null;

  req.session.destroy();

  res.clearCookie("tempoInativoMaximoFront");

  return res.redirect("/login");
}

module.exports = {
  Login,
  Logout
};
