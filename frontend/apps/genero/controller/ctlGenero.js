// ctlGenero.js
const axios = require("axios");

const manutGenero = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;

    const resp = await axios.get(process.env.bibliotecaDW3 + "/getAllGenero", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    }).catch(error => {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error;

      return res.render("genero/view/vwManutGenero.njk", { title: "Manutenção de gêneros", data: null, erro: remoteMSG, username });
    });

    if (!resp) return;

    res.render("genero/view/vwManutGenero.njk", { title: "Manutenção de gêneros", data: resp.data.registro, erro: null, username });
  })();

const insertGenero = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      return res.render("genero/view/vwFCGenero.njk", { title: "Cadastro de gênero", data: null, erro: null, username: null });
    } else {
      const regData = req.body;
      const token = req.session.token;
      try {
        const response = await axios.post(process.env.bibliotecaDW3 + "/insertGenero", {
          nome: regData.nome,
          removido: regData.removido || false
        }, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          timeout: 5000
        });
        res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
      } catch (error) {
        console.error('Erro ao inserir genero:', error.message);
        res.json({ status: "Error", msg: error.message, erro: null });
      }
    }
  })();

const viewGenero = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getGeneroByID", { generoid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          res.render("genero/view/vwFRUDrGenero.njk", { title: "Visualização de gênero", data: response.data.registro[0], disabled: true, username });
        } else console.log("[ctlGenero|viewGenero] ID não localizado.");
      }
    } catch (erro) {
      res.json({ status: "[ctlGenero.js|viewGenero] Gênero não localizado!" });
      console.log("Erro:", erro);
    }
  })();

const updateGenero = async (req, res) =>
  (async () => {
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getGeneroByID", { generoid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          res.render("genero/view/vwFRUDrGenero.njk", { title: "Atualização de gênero", data: response.data.registro[0], disabled: false, username: req.session.username });
        }
      } else {
        const regData = req.body;
        try {
          const response = await axios.post(process.env.bibliotecaDW3 + "/updateGenero", {
            id: regData.id,
            nome: regData.nome,
            removido: regData.removido
          }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            timeout: 5000
          });
          res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
        } catch (error) {
          console.error('Erro ao atualizar genero:', error.message);
          res.json({ status: "Error", msg: error.message, erro: null });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlGenero.js|updateGenero] Gênero não localizado!" });
    }
  })();

const deleteGenero = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.bibliotecaDW3 + "/deleteGenero", { id: regData.id, removido: true }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
    } catch (error) {
      console.error('Erro ao deletar genero:', error.message);
      res.json({ status: "Error", msg: error.message, erro: null });
    }
  })();

module.exports = { 
 manutGenero,
 insertGenero,
 viewGenero, 
 updateGenero, 
 deleteGenero };
