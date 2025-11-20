// ctlLivro.js
const axios = require("axios");

const manutLivro = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.bibliotecaDW3 + "/getAllLivro", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    }).catch(error => {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error;

      return res.render("livro/view/vwManutLivro.njk", { title: "Manutenção de livros", data: null, erro: remoteMSG, userName });
    });

    if (!resp) return;

    res.render("livro/view/vwManutLivro.njk", { title: "Manutenção de livros", data: resp.data.registro, erro: null, userName });
  })();

const insertLivro = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;
      // busca generos para popular select
      const generos = await axios.get(process.env.bibliotecaDW3 + "/getAllGenero", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      });
      return res.render("livro/view/vwFCLivro.njk", { title: "Cadastro de livro", data: null, erro: null, generos: generos.data.registro, userName: null });
    } else {
      const regData = req.body;
      const token = req.session.token;
      try {
        const response = await axios.post(process.env.bibliotecaDW3 + "/insertLivro", {
          titulo: regData.titulo,
          autor: regData.autor,
          editora: regData.editora,
          isbn: regData.isbn,
          edicao: regData.edicao,
          ano_publicacao: regData.ano_publicacao,
          id_genero: regData.id_genero,
          removido: regData.removido || false
        }, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          timeout: 5000
        });
        res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
      } catch (error) {
        console.error('Erro ao inserir livro:', error.message);
        res.json({ status: "Error", msg: error.message, erro: null });
      }
    }
  })();

const viewLivro = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getLivroByID", { livroid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          // obter generos para exibir select
          const generos = await axios.get(process.env.bibliotecaDW3 + "/getAllGenero", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          });

          res.render("livro/view/vwFRUDrLivro.njk", {
            title: "Visualização de livro",
            data: response.data.registro[0],
            disabled: true,
            generos: generos.data.registro,
            userName
          });
        } else console.log("[ctlLivro|viewLivro] ID não localizado.");
      }
    } catch (erro) {
      res.json({ status: "[ctlLivro.js|viewLivro] Livro não localizado!" });
      console.log("Erro:", erro);
    }
  })();

const updateLivro = async (req, res) =>
  (async () => {
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getLivroByID", { livroid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          const generos = await axios.get(process.env.bibliotecaDW3 + "/getAllGenero", {
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
          });

          res.render("livro/view/vwFRUDrLivro.njk", {
            title: "Atualização de livro",
            data: response.data.registro[0],
            disabled: false,
            generos: generos.data.registro,
            userName: req.session.userName
          });
        }
      } else {
        const regData = req.body;
        try {
          const response = await axios.post(process.env.bibliotecaDW3 + "/updateLivro", {
            id: regData.id,
            titulo: regData.titulo,
            autor: regData.autor,
            editora: regData.editora,
            isbn: regData.isbn,
            edicao: regData.edicao,
            ano_publicacao: regData.ano_publicacao,
            id_genero: regData.id_genero,
            removido: regData.removido
          }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            timeout: 5000
          });

          res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
        } catch (error) {
          console.error('Erro ao atualizar livro:', error.message);
          res.json({ status: "Error", msg: error.message, erro: null });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlLivro.js|updateLivro] Livro não localizado!" });
    }
  })();

const deleteLivro = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.bibliotecaDW3 + "/deleteLivro", { id: regData.id, removido: true }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
    } catch (error) {
      console.error('Erro ao deletar livro:', error.message);
      res.json({ status: "Error", msg: error.message, erro: null });
    }
  })();

module.exports = { 
manutLivro, 
insertLivro, 
viewLivro, 
updateLivro, 
deleteLivro 
};