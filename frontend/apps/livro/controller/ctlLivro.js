const axios = require("axios");


const axiosConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  timeout: 5000
});

const manutLivro = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLivro", axiosConfig(token));

    res.render("livro/view/vwManutLivro.njk", {
      title: "Manutenção de Livros",
      data: resp.data.registros,
      erro: null,
      username: username,
    });
  } catch (error) {
    console.error('[manutLivro] Erro:', error.message);
    const remoteMSG = (error.code === "ECONNREFUSED") ? "Servidor indisponível" : error.message;
    
    res.render("livro/view/vwManutLivro.njk", {
      title: "Manutenção de Livros",
      data: null,
      erro: remoteMSG,
      username: username,
    });
  }
};

const insertLivro = async (req, res) => {
  const token = req.session.token;
  const username = req.session.username;

  if (req.method == "GET") {
    try {
      // Busca Gêneros para preencher o <select>
      const generos = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllGenero", axiosConfig(token));
      
      res.render("livro/view/vwFCrLivro.njk", {
        title: "Cadastro de Livro",
        data: null,
        erro: null,
        generos: generos.data.registros, // Plural
        username: username
      });
    } catch (error) {
      console.error('[insertLivro|GET] Erro:', error.message);
      res.render("livro/view/vwFCrLivro.njk", { title: "Erro", erro: "Erro ao carregar gêneros", username: username });
    }
  } else {
    const regData = req.body;
    try {
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/insertLivro",
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
      console.error('[insertLivro|POST] Erro:', error.message);
      const msg = error.response ? error.response.data.mensagem : error.message;
      res.json({ status: "Error", msg: msg, erro: null });
    }
  }
};

const viewLivro = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = parseInt(req.params.id);

      // Validação
      if (isNaN(id) || id <= 0) {
        return res.redirect("/livro/manutLivro");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getLivroByID",
        { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        // Busca Gêneros para mostrar o nome no select
        const generos = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllGenero", axiosConfig(token));

        res.render("livro/view/vwFRUDrLivro.njk", {
          title: "Visualização de Livro",
          data: response.data.registro,
          disabled: true,
          generos: generos.data.registros,
          username: username
        });
      } else {
        console.log("[viewLivro] ID não localizado.");
        res.redirect("/livro/manutLivro");
      }
    }
  } catch (erro) {
    console.log("[viewLivro] Erro:", erro.message);
    res.render("livro/view/vwManutLivro.njk", {
      title: "Manutenção de Livros",
      data: null,
      erro: "Erro ao buscar dados do livro",
      username: username
    });
  }
};

const updateLivro = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const id = parseInt(req.params.id);

      if (isNaN(id) || id <= 0) {
        return res.redirect("/livro/manutLivro");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getLivroByID",
        { id: id },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        const generos = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllGenero", axiosConfig(token));

        res.render("livro/view/vwFRUDrLivro.njk", {
          title: "Edição de Livro",
          data: response.data.registro,
          disabled: false,
          generos: generos.data.registros,
          username: username
        });
      }
    } else {
      const regData = req.body;
      
      const idBody = parseInt(regData.id);
      if (isNaN(idBody)) return res.json({ status: "Error", msg: "ID inválido" });

      try {
        const response = await axios.post(
          process.env.SERVIDOR_BIBLIOTECA_BACK + "/updateLivro",
          regData,
          axiosConfig(token)
        );

        res.json({
          status: response.data.status,
          msg: response.data.mensagem || "Atualizado com sucesso",
          data: response.data.registro,
          erro: null,
        });
      } catch (error) {
        console.error('[updateLivro] Erro:', error.message);
        const msg = error.response ? error.response.data.mensagem : error.message;
        res.json({ status: "Error", msg: msg });
      }
    }
  } catch (error) {
    console.error('[updateLivro] Geral:', error.message);
    if (req.method === "GET") return res.redirect("/livro/manutLivro");
    res.json({ status: "Error", msg: error.message });
  }
};

const deleteLivro = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    const id = parseInt(regData.id);
    if (isNaN(id)) return res.json({ status: "Error", msg: "ID inválido" });

    const response = await axios.post(
      process.env.SERVIDOR_BIBLIOTECA_BACK + "/deleteLivro",
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
    console.error('[deleteLivro] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    res.json({ status: "Error", msg: msg });
  }
};

module.exports = { 
  manutLivro, 
  insertLivro, 
  viewLivro, 
  updateLivro, 
  deleteLivro 
};