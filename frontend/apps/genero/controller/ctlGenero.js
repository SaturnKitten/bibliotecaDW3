const axios = require("axios");

const axiosConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  timeout: 5000
});

const manutGenero = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllGenero", axiosConfig(token));

    res.render("genero/view/vwManutGenero.njk", {
      title: "Manutenção de Gêneros",
      data: resp.data.registros,
      erro: null,
      username: username,
    });
  } catch (error) {
    console.error('[manutGenero] Erro:', error.message);
    const remoteMSG = (error.code === "ECONNREFUSED") ? "Servidor indisponível" : error.message;
    
    res.render("genero/view/vwManutGenero.njk", {
      title: "Manutenção de Gêneros",
      data: null,
      erro: remoteMSG,
      username: username,
    });
  }
};

const insertGenero = async (req, res) => {
  const token = req.session.token;
  const username = req.session.username;

  if (req.method == "GET") {
    res.render("genero/view/vwFCrGenero.njk", {
      title: "Cadastro de Gênero",
      data: null,
      erro: null,
      username: username,
    });
  } else {
    // POST
    const regData = req.body;
    try {
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/insertGenero",
        regData,
        axiosConfig(token)
      );

      res.json({
        status: response.data.status,
        msg: response.data.mensagem,
        data: response.data.registro,
        erro: null,
      });
    } catch (error) {
      console.error('[insertGenero] Erro:', error.message);
      const msg = error.response ? error.response.data.mensagem : error.message;
      res.json({ status: "Error", msg: msg, erro: null });
    }
  }
};

const viewGenero = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.redirect("/genero/manutGenero");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getGeneroByID",
        { id: id }, 
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        res.render("genero/view/vwFRUDrGenero.njk", {
          title: "Visualização de Gênero",
          data: response.data.registro, // Sem [0]
          disabled: true,
          username: username,
        });
      } else {
        console.log("[viewGenero] ID não localizado.");
        res.redirect("/genero/manutGenero");
      }
    }
  } catch (erro) {
    console.log("[viewGenero] Erro:", erro.message);
    res.render("genero/view/vwManutGenero.njk", {
      title: "Manutenção de Gêneros",
      data: null,
      erro: "Erro ao buscar dados do gênero",
      username: username
    });
  }
};

const updateGenero = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.redirect("/genero/manutGenero");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getGeneroByID",
        { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        res.render("genero/view/vwFRUDrGenero.njk", {
          title: "Edição de Gênero",
          data: response.data.registro,
          disabled: false,
          username: username,
        });
      }
    } else {
      const regData = req.body;
      
      const idBody = parseInt(regData.id);
      if (isNaN(idBody)) return res.json({ status: "Error", msg: "ID inválido" });

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/updateGenero",
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
  } catch (error) {
    console.error('[updateGenero] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    
    if (req.method === "GET") return res.redirect("/genero/manutGenero");
    
    res.json({ status: "Error", msg: msg });
  }
};

const deleteGenero = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    const id = parseInt(regData.id);
    if (isNaN(id)) return res.json({ status: "Error", msg: "ID inválido" });

    const response = await axios.post(
      process.env.SERVIDOR_BIBLIOTECA_BACK + "/deleteGenero",
      { id: id },
      axiosConfig(token)
    );

    res.json({
      status: response.data.status || "ok",
      msg: response.data.mensagem || "Removido com sucesso",
      data: response.data,
      erro: null,
    });
  } catch (error) {
    console.error('[deleteGenero] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    res.json({ status: "Error", msg: msg });
  }
};

module.exports = { 
  manutGenero, 
  insertGenero, 
  viewGenero, 
  updateGenero, 
  deleteGenero 
};