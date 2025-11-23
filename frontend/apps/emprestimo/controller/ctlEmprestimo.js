const axios = require("axios");
const moment = require("moment");

const axiosConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  timeout: 5000
});

// Manutenção
const manutEmprestimo = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllEmprestimo", axiosConfig(token));

    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de Empréstimos",
      data: resp.data.registros,
      erro: null,
      username: username,
    });
  }
  catch (error) {
    console.error('[manutEmprestimo] Erro:', error.message);
    const remoteMSG = error.code === "ECONNREFUSED" ? "Servidor indisponível" : error.message;

    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de Empréstimos",
      data: null,
      erro: remoteMSG,
      username: username,
    });
  }
};

// Inserir
const insertEmprestimo = async (req, res) => {
  const token = req.session.token;
  const username = req.session.username;

  if (req.method == "GET") {
    try {
      const respLivros = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLivro", axiosConfig(token));
      const respLeitores = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLeitor", axiosConfig(token));

      res.render("emprestimo/view/vwFCrEmprestimo.njk", {
        title: "Cadastro de Empréstimo",
        data: null,
        erro: null,
        username: username,
        livros: respLivros.data.registros,
        leitores: respLeitores.data.registros
      });
    }
    catch (error) {
      console.error('[insertEmprestimo|GET] Erro ao carregar listas:', error.message);
      res.render("emprestimo/view/vwFCrEmprestimo.njk", {
        title: "Cadastro de Empréstimo",
        erro: "Erro ao carregar dados de Livros ou Leitores",
        username: username
      });
    }
  }
  else {
    // POST
    const regData = req.body;
    try {
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/insertEmprestimo",
        regData,
        axiosConfig(token)
      );

      res.json({
        status: response.data.status,
        msg: response.data.mensagem,
        data: response.data.registro,
        erro: null,
      });

    }
    catch (error) {
      console.error('[insertEmprestimo|POST] Erro:', error.message);
      const msg = error.response ? error.response.data.mensagem : error.message;
      res.json({ status: "Error", msg: msg, erro: null });
    }
  }
};

// Visualizar
const viewEmprestimo = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = req.params.id;

      // Busca o empréstimo
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getEmprestimoByID",
        { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        const reg = response.data.registro;

        // Formata as datas para exibir no input date (YYYY-MM-DD)
        reg.data_emprestimo = moment(reg.data_emprestimo).format("YYYY-MM-DD");
        reg.data_vencimento = moment(reg.data_vencimento).format("YYYY-MM-DD");

        const respLivros = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLivro", axiosConfig(token));
        const respLeitores = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLeitor", axiosConfig(token));

        res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
          title: "Visualização de Empréstimo",
          data: reg,
          disabled: true,
          username: username,
          livros: respLivros.data.registros,
          leitores: respLeitores.data.registros
        });
      }
      else {
        res.redirect("/emprestimo/manutEmprestimo");
      }
    }
  }
  catch (erro) {
    console.log("[viewEmprestimo] Erro:", erro.message);

    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de Empréstimos",
      data: null,
      erro: "Erro ao buscar dados do empréstimo",
      username: username
    });
  }
};

// Atualizar
const updateEmprestimo = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const idParam = req.params.id;
      const id = parseInt(idParam);

      if (isNaN(id) || id <= 0) {
        console.log("[updateEmprestimo] ID inválido na URL.");
        return res.redirect("/emprestimo/manutEmprestimo");
      }

      const response = await axios.post(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getEmprestimoByID", { id: id }, axiosConfig(token));

      if (response.data.status == "ok") {
        const reg = response.data.registro;

        // Formatação de datas
        reg.data_emprestimo = moment(reg.data_emprestimo).format("YYYY-MM-DD");
        reg.data_vencimento = moment(reg.data_vencimento).format("YYYY-MM-DD");

        const respLivros = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLivro", axiosConfig(token));
        const respLeitores = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLeitor", axiosConfig(token));

        res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
          title: "Edição de Empréstimo",
          data: reg,
          disabled: false,
          username: username,
          livros: respLivros.data.registros,
          leitores: respLeitores.data.registros
        });
      }
      else {
        console.log("[updateEmprestimo] Empréstimo não encontrado.");
        res.redirect("/emprestimo/manutEmprestimo");
      }
    }
    else {
      const regData = req.body;

      const idBody = parseInt(regData.id);
      if (isNaN(idBody)) {
        return res.status(400).json({ status: "Error", msg: "ID inválido no envio." });
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/updateEmprestimo",
        regData,
        axiosConfig(token)
      );

      res.json({
        status: response.data.status,
        msg: response.data.mensagem || "Atualizado com sucesso",
        data: response.data.registro,
        erro: null,
      });
    }
  }
  catch (error) {
    console.error('[updateEmprestimo] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;

    if (req.method === "GET") {
      return res.render("emprestimo/view/vwManutEmprestimo.njk", {
        title: "Manutenção de Empréstimos",
        data: null,
        erro: `Erro ao carregar edição: ${msg}`,
        username: username
      });
    }

    res.json({ status: "Error", msg: msg });
  }
};

// Delete
const deleteEmprestimo = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    const response = await axios.post(
      process.env.SERVIDOR_BIBLIOTECA_BACK + "/deleteEmprestimo",
      { id: regData.id },
      axiosConfig(token)
    );

    res.json({
      status: response.data.status || "ok",
      msg: response.data.mensagem || "Removido com sucesso",
      data: response.data,
      erro: null,
    });
  } catch (error) {
    console.error('[deleteEmprestimo] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    res.json({ status: "Error", msg: msg });
  }
};


module.exports = {
  manutEmprestimo,
  insertEmprestimo,
  viewEmprestimo,
  updateEmprestimo,
  deleteEmprestimo
};