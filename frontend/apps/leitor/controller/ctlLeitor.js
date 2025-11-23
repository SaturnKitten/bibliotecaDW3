// ctlLeitor.js
const axios = require("axios");
const moment = require("moment");

const manutLeitor = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;

    const resp = await axios.get(process.env.bibliotecaDW3 + "/getAllLeitor", {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    }).catch(error => {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error;

      return res.render("leitor/view/vwManutLeitor.njk", { title: "Manutenção de leitores", data: null, erro: remoteMSG, username });
    });

    if (!resp) return;

    res.render("leitor/view/vwManutLeitor.njk", { title: "Manutenção de leitores", data: resp.data.registro, erro: null, username });
  })();

const insertLeitor = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      return res.render("leitor/view/vwFCLeitor.njk", { title: "Cadastro de leitor", data: null, erro: null, username: null });
    } else {
      const regData = req.body;
      const token = req.session.token;
      try {
        const response = await axios.post(process.env.bibliotecaDW3 + "/insertLeitor", {
          nome: regData.nome,
          email: regData.email,
          cpf: regData.cpf,
          data_nascimento: regData.data_nascimento,
          removido: regData.removido || false
        }, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          timeout: 5000
        });
        res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
      } catch (error) {
        console.error('Erro ao inserir leitor:', error.message);
        res.json({ status: "Error", msg: error.message, erro: null });
      }
    }
  })();

const viewLeitor = async (req, res) =>
  (async () => {
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getLeitorByID", { leitorid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          response.data.registro[0].data_nascimento = moment(response.data.registro[0].data_nascimento).format("YYYY-MM-DD");
          res.render("leitor/view/vwFRUDrLeitor.njk", { title: "Visualização de leitor", data: response.data.registro[0], disabled: true, username: req.session.username });
        } else console.log("[ctlLeitor|viewLeitor] ID não localizado.");
      }
    } catch (erro) {
      res.json({ status: "[ctlLeitor.js|viewLeitor] Leitor não localizado!" });
      console.log("Erro:", erro);
    }
  })();

const updateLeitor = async (req, res) =>
  (async () => {
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getLeitorByID", { leitorid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          response.data.registro[0].data_nascimento = moment(response.data.registro[0].data_nascimento).format("YYYY-MM-DD");
          res.render("leitor/view/vwFRUDrLeitor.njk", { title: "Atualização de leitor", data: response.data.registro[0], disabled: false, username: req.session.username });
        }
      } else {
        const regData = req.body;
        try {
          const response = await axios.post(process.env.bibliotecaDW3 + "/updateLeitor", {
            id: regData.id,
            nome: regData.nome,
            email: regData.email,
            cpf: regData.cpf,
            data_nascimento: regData.data_nascimento,
            removido: regData.removido
          }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            timeout: 5000
          });
          res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
        } catch (error) {
          console.error('Erro ao atualizar leitor:', error.message);
          res.json({ status: "Error", msg: error.message, erro: null });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlLeitor.js|updateLeitor] Leitor não localizado!" });
    }
  })();

const deleteLeitor = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.bibliotecaDW3 + "/deleteLeitor", { id: regData.id, removido: true }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
    } catch (error) {
      console.error('Erro ao deletar leitor:', error.message);
      res.json({ status: "Error", msg: error.message, erro: null });
    }
  })();

module.exports = { 
  manutLeitor, 
  insertLeitor, 
  viewLeitor, 
  updateLeitor, 
  deleteLeitor 
};