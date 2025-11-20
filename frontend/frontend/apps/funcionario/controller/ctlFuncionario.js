// ctlFuncionario.js
const axios = require("axios");

const manutFuncionario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;

    const resp = await axios.get(process.env.bibliotecaDW3 + "/getAllFuncionario", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(error => {
      let remoteMSG;
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error;

      return res.render("funcionario/view/vwManutFuncionario.njk", {
        title: "Manutenção de funcionários",
        data: null,
        erro: remoteMSG,
        userName: userName,
      });
    });

    if (!resp) return;

    res.render("funcionario/view/vwManutFuncionario.njk", {
      title: "Manutenção de funcionários",
      data: resp.data.registro,
      erro: null,
      userName: userName,
    });
  })();

const insertFuncionario = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      return res.render("funcionario/view/vwFCFuncionario.njk", {
        title: "Cadastro de funcionário",
        data: null,
        erro: null,
        userName: null,
      });
    } else {
      const regData = req.body;
      const token = req.session.token;
      try {
        const response = await axios.post(process.env.bibliotecaDW3 + "/insertFuncionario", {
          nome: regData.nome,
          username: regData.username,
          password: regData.password,
          email: regData.email,
          removido: regData.removido || false
        }, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          timeout: 5000,
        });

        res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
      } catch (error) {
        console.error('Erro ao inserir funcionario:', error.message);
        res.json({ status: "Error", msg: error.message, erro: null });
      }
    }
  })();

const viewFuncionario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getFuncionarioByID", { funcionarioid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          res.render("funcionario/view/vwFRUDrFuncionario.njk", {
            title: "Visualização de funcionário",
            data: response.data.registro[0],
            disabled: true,
            userName: userName,
          });
        } else {
          console.log("[ctlFuncionario|viewFuncionario] ID de funcionario não localizado!");
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlFuncionario.js|viewFuncionario] Funcionário não localizado!" });
      console.log("[ctlFuncionario.js|viewFuncionario] Erro:", erro);
    }
  })();

const updateFuncionario = async (req, res) =>
  (async () => {
    const userName = req.session.userName;
    const token = req.session.token;
    try {
      if (req.method == "GET") {
        const id = req.params.id;
        parseInt(id);

        const response = await axios.post(process.env.bibliotecaDW3 + "/getFuncionarioByID", { funcionarioid: id }, {
          headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
        });

        if (response.data.status == "ok") {
          res.render("funcionario/view/vwFRUDrFuncionario.njk", {
            title: "Atualização de funcionário",
            data: response.data.registro[0],
            disabled: false,
            userName: userName,
          });
        }
      } else {
        const regData = req.body;
        try {
          const response = await axios.post(process.env.bibliotecaDW3 + "/updateFuncionario", {
            id: regData.id,
            nome: regData.nome,
            username: regData.username,
            password: regData.password,
            email: regData.email,
            removido: regData.removido
          }, {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            timeout: 5000,
          });

          res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
        } catch (error) {
          console.error('Erro ao atualizar funcionario:', error.message);
          res.json({ status: "Error", msg: error.message, erro: null });
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlFuncionario.js|updateFuncionario] Funcionário não localizado!" });
    }
  })();

const deleteFuncionario = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;
    try {
      const response = await axios.post(process.env.bibliotecaDW3 + "/deleteFuncionario", {
        id: regData.id,
        removido: true
      }, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        timeout: 5000,
      });

      res.json({ status: response.data.status, msg: response.data.status, data: response.data, erro: null });
    } catch (error) {
      console.error('Erro ao deletar funcionario:', error.message);
      res.json({ status: "Error", msg: error.message, erro: null });
    }
  })();

module.exports = {
  manutFuncionario,
  insertFuncionario,
  viewFuncionario,
  updateFuncionario,
  deleteFuncionario
};
