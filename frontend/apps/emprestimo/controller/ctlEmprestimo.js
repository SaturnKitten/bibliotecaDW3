const axios = require("axios");
const moment = require("moment");


const manutEmprestimo = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;

    const resp = await axios.get(process.env.bibliotecaDW3 + "/getAllEmprestimo", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).catch(error => {
      if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
      else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
      else remoteMSG = error;

      return res.render("emprestimo/view/vwManutEmprestimo.njk", {
        title: "Manutenção de emprestimos",
        data: null,
        erro: remoteMSG,
        username: username,
      });
    });

    if (!resp) return;

    res.render("emprestimo/view/vwManutEmprestimo.njk", {
      title: "Manutenção de emprestimos",
      data: resp.data.registro,
      erro: null,
      username: username,
    });
  })();


const insertEmprestimo = async (req, res) =>
  (async () => {
    if (req.method == "GET") {
      const token = req.session.token;

      const cursos = await axios.get(process.env.bibliotecaDW3 + "/GetAll", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      return res.render("emprestimo/view/vwFCrEmprestimo.njk", {
        title: "Cadastro de emprestimos",
        data: null,
        erro: null,
        curso: cursos.data.registro,
        username: null,
      });

    } else {
      const regData = req.body;
      const token = req.session.token;

      try {
        const response = await axios.post(process.env.bibliotecaDW3 + "/insertEmprestimo", {
          id_livro: regData.id_livro,
          id_leitor: regData.id_leitor,
          data_emprestimo: regData.data_emprestimo,
          data_vencimento: regData.data_vencimento,
          status: regData.status,
          multa_atraso: regData.multa_atraso
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        });

        res.json({
          status: response.data.status,
          msg: response.data.status,
          data: response.data,
          erro: null,
        });

      } catch (error) {
        console.error('Erro ao inserir dados no servidor backend:', error.message);
        res.json({
          status: "Error",
          msg: error.message,
          erro: null,
        });
      }
    }
  })();

const viewEmprestimo = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;

    try {
      if (req.method == "GET") {
        const id = req.params.id;
        oper = req.params.oper;
        parseInt(id);

        response = await axios.post(
          process.env.bibliotecaDW3 + "/getEmprestimoByID",
          { emprestimoid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {

          const cursos = await axios.get(process.env.bibliotecaDW3 + "/GetAll", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          // datas formatadas
          response.data.registro[0].data_emprestimo =
            moment(response.data.registro[0].data_emprestimo).format("YYYY-MM-DD");

          response.data.registro[0].data_vencimento =
            moment(response.data.registro[0].data_vencimento).format("YYYY-MM-DD");

          res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
            title: "Visualização de emprestimos",
            data: response.data.registro[0],
            disabled: true,
            curso: cursos.data.registro,
            username: username,
          });

        } else {
          console.log("[ctlEmprestimo|ViewEmprestimo] ID não localizado!");
        }
      }
    } catch (erro) {
      res.json({ status: "[ctlEmprestimo.js|ViewEmprestimo] Emprestimo não localizado!" });
      console.log("Erro:", erro);
    }
  })();


const updateEmprestimo = async (req, res) =>
  (async () => {
    const username = req.session.username;
    const token = req.session.token;

    try {
      if (req.method == "GET") {

        const id = req.params.id;
        parseInt(id);

        response = await axios.post(
          process.env.bibliotecaDW3 + "/getEmprestimoByID",
          { emprestimoid: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.data.status == "ok") {

          const cursos = await axios.get(process.env.bibliotecaDW3 + "/GetAll", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            }
          });

          response.data.registro[0].data_emprestimo =
            moment(response.data.registro[0].data_emprestimo).format("YYYY-MM-DD");
          response.data.registro[0].data_vencimento =
            moment(response.data.registro[0].data_vencimento).format("YYYY-MM-DD");

          res.render("emprestimo/view/vwFRUDrEmprestimo.njk", {
            title: "Atualização de dados de emprestimos",
            data: response.data.registro[0],
            disabled: false,
            curso: cursos.data.registro,
            username: username,
          });

        }

      } else {
        const regData = req.body;

        try {
          const response = await axios.post(
            process.env.bibliotecaDW3 + "/updateEmprestimo",
            {
              id: regData.id,
              id_livro: regData.id_livro,
              id_leitor: regData.id_leitor,
              data_emprestimo: regData.data_emprestimo,
              data_vencimento: regData.data_vencimento,
              status: regData.status,
              multa_atraso: regData.multa_atraso
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              timeout: 5000,
            }
          );

          res.json({
            status: response.data.status,
            msg: response.data.status,
            data: response.data,
            erro: null,
          });

        } catch (error) {
          console.error('Erro ao atualizar emprestimo:', error.message);
          res.json({
            status: "Error",
            msg: error.message,
            erro: null,
          });
        }
      }

    } catch (erro) {
      res.json({
        status: "[ctlEmprestimo.js|UpdateEmprestimo] Emprestimo não localizado!"
      });
    }

  })();


const deleteEmprestimo = async (req, res) =>
  (async () => {
    const regData = req.body;
    const token = req.session.token;

    try {
      const response = await axios.post(
        process.env.bibliotecaDW3 + "/DeleteEmprestimo",
        {
          id: regData.id,
          removido: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 5000,
        }
      );

      res.json({
        status: response.data.status,
        msg: response.data.status,
        data: response.data,
        erro: null,
      });

    } catch (error) {
      console.error('Erro ao deletar emprestimo:', error.message);
      res.json({
        status: "Error",
        msg: error.message,
        erro: null,
      });
    }

  })();


module.exports = {
  manutEmprestimo,
  insertEmprestimo,
  viewEmprestimo,
  updateEmprestimo,
  deleteEmprestimo
};