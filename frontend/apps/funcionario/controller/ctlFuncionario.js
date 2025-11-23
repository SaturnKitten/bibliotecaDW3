const axios = require("axios");
const moment = require("moment");

const axiosConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  timeout: 5000
});

// Manutenção (listagem)
const manutFuncionario = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllFuncionario", axiosConfig(token));

    res.render("funcionario/view/vwManutFuncionario.njk", {
      title: "Manutenção de Funcionários",
      data: resp.data.registros,
      erro: null,
      username: username,
      token: token
    });
  }
  catch (error) {
    console.error('[manutFuncionario] Erro:', error.message);
    const remoteMSG = (error.code === "ECONNREFUSED") ? "Servidor indisponível" : error.message;

    res.render("funcionario/view/vwManutFuncionario.njk", {
      title: "Manutenção de Funcionários",
      data: null,
      erro: remoteMSG,
      username: username,
      token: token
    });
  }
};

// Inserir
const insertFuncionario = async (req, res) => {
  const token = req.session.token;
  const username = req.session.username;

  if (req.method == "GET") {
    res.render("funcionario/view/vwFCrFuncionario.njk", {
      title: "Cadastro de Funcionário",
      data: null,
      erro: null,
      username: username,
    });
  } else {
    // POST
    const regData = req.body;
    try {
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/insertFuncionario",
        regData,
        axiosConfig(token)
      );

      res.json({
        status: response.data.status,
        msg: response.data.mensagem,
        data: response.registro,
        erro: null,
      });
    } catch (error) {
      console.error('[insertFuncionario] Erro:', error.message);
      const msg = error.response ? error.response.data.mensagem : error.message;
      res.json({ status: "Error", msg: msg, erro: null });
    }
  }
};

// Visualizar
const viewFuncionario = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = req.params.id;

      const response = await axios.post(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getFuncionarioByID", { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        res.render("funcionario/view/vwFRUDrFuncionario.njk", {
          title: "Visualização de Funcionário",
          data: response.data.registro,
          disabled: true, // Bloqueia campos
          username: username,
        });
      } else {
        console.log("[viewFuncionario] ID não localizado!");
        res.redirect("/funcionario/manutFuncionario");
      }
    }
  } catch (erro) {
    console.log("[viewFuncionario] Erro:", erro.message);
    res.render("funcionario/view/vwManutFuncionario.njk", {
      title: "Manutenção de Funcionários",
      data: null,
      erro: "Erro ao buscar dados do funcionário",
      username: username
    });
  }
};

// Atualizar
const updateFuncionario = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const idParam = req.params.id; // Lê o ID da URL
      const id = parseInt(idParam); // Validação do ID da URL

      if (isNaN(id) || id <= 0) {
        return res.status(400).render("funcionario/view/vwManutFuncionario.njk", {
          title: "Manutenção de Funcionários",
          erro: "ID do funcionário inválido na URL.",
          username: username
        });
      }

      // Busca dados para preencher form
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getFuncionarioByID",
        { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        res.render("funcionario/view/vwFRUDrFuncionario.njk", {
          title: "Edição de Funcionário",
          data: response.data.registro,
          disabled: false,
          username: username,
        });
      }
    } else {
      const regData = req.body;

      const idBody = parseInt(regData.id);
      if (isNaN(idBody) || idBody <= 0) {
        return res.status(400).json({ status: "Error", msg: "ID de atualização inválido no corpo da requisição." });
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/updateFuncionario",
        regData,
        axiosConfig(token)
      );

      res.json({
        status: response.data.status,
        msg: response.data.mensagem || "Atualizado com sucesso",
        data: response.data,
        erro: null,
      });
    }
  } catch (error) {
    console.error('[updateFuncionario] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;

    // Se o erro ocorreu durante o GET
    if (req.method === "GET") {
      // Redireciona de volta para a lista principal para não quebrar a tela
      return res.redirect("/funcionario/manutFuncionario");
    }
    // Se o erro ocorreu durante o POST
    res.json({ status: "Error", msg: msg });
  }
};

// Deletar
const deleteFuncionario = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    const id = parseInt(regData.id);

    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ status: "Error", msg: "ID inválido para exclusão." });
    }

    const response = await axios.post(
      process.env.SERVIDOR_BIBLIOTECA_BACK + "/deleteFuncionario",
      { id: regData.id }, // Envia apenas o ID
      axiosConfig(token)
    );

    res.json({
      status: response.data.status || "ok",
      msg: response.data.mensagem || "Removido com sucesso",
      data: response.data,
      erro: null,
    });
    
  } catch (error) {
    console.error('[deleteFuncionario] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    res.json({ status: "Error", msg: msg });
  }
};

module.exports = {
  manutFuncionario,
  insertFuncionario,
  viewFuncionario,
  updateFuncionario,
  deleteFuncionario
};
