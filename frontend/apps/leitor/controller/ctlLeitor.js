const axios = require("axios");
const moment = require("moment");

const axiosConfig = (token) => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  timeout: 5000
});

const manutLeitor = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    const resp = await axios.get(process.env.SERVIDOR_BIBLIOTECA_BACK + "/getAllLeitor", axiosConfig(token));

    res.render("leitor/view/vwManutLeitor.njk", {
      title: "Manutenção de Leitores",
      data: resp.data.registros,
      erro: null,
      username: username,
    });
  }
  catch (error) {
    console.error('[manutLeitor] Erro:', error.message);
    let remoteMSG;
    if (error.code === "ECONNREFUSED") remoteMSG = "Servidor indisponível";
    else if (error.code === "ERR_BAD_REQUEST") remoteMSG = "Usuário não autenticado";
    else remoteMSG = error.message;

    res.render("leitor/view/vwManutLeitor.njk", {
      title: "Manutenção de Leitores",
      data: null,
      erro: remoteMSG,
      username: username,
    });
  }
};

const insertLeitor = async (req, res) => {
  const token = req.session.token;
  const username = req.session.username;

  if (req.method == "GET") {
    return res.render("leitor/view/vwFCrLeitor.njk", {
      title: "Cadastro de Leitor",
      data: null,
      erro: null,
      username: username,
    });
  } else {
    // POST
    const regData = req.body;
    try {
      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/insertLeitor",
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
      console.error('[insertLeitor] Erro:', error.message);
      const msg = error.response ? error.response.data.mensagem : error.message;
      res.json({ status: "Error", msg: msg, erro: null });
    }
  }
};

const viewLeitor = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const idParam = req.params.id;
      const idLeitor = parseInt(idParam);

      if (isNaN(idLeitor) || idLeitor <= 0) {
        console.log("[viewLeitor] ID inválido.");
        return res.redirect("/leitor/manutLeitor");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getLeitorByID",
        { id: idLeitor },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        const reg = response.data.registro;

        // Formatar Data para o HTML (YYYY-MM-DD)
        reg.data_nascimento = moment(reg.data_nascimento).format("YYYY-MM-DD");

        res.render("leitor/view/vwFRUDrLeitor.njk", {
          title: "Visualização de Leitor",
          data: reg,
          disabled: true, // Bloqueia os campos
          username: username
        });
      }
      else {
        console.log("[viewLeitor] ID não localizado.");
        res.redirect("/leitor/manutLeitor");
      }
    }
  } catch (erro) {
    console.log("[viewLeitor] Erro:", erro.message);
    res.render("leitor/view/vwManutLeitor.njk", {
      title: "Manutenção de Leitores",
      data: null,
      erro: "Erro ao buscar dados do leitor",
      username: username
    });
  }
};

const updateLeitor = async (req, res) => {
  const username = req.session.username;
  const token = req.session.token;

  try {
    if (req.method == "GET") {
      const idParam = req.params.id;
      const idLeitor = parseInt(idParam);

      // Validação de ID na URL
      if (isNaN(idLeitor) || idLeitor <= 0) {
        console.log("[updateLeitor] ID inválido.");
        return res.redirect("/leitor/manutLeitor");
      }

      const response = await axios.post(
        process.env.SERVIDOR_BIBLIOTECA_BACK + "/getLeitorByID",
        { id: idLeitor },
        axiosConfig(token)
      );

      if (response.data.status == "ok") {
        const reg = response.data.registro;

        // 3. Formatar Data para o input HTML (YYYY-MM-DD)
        reg.data_nascimento = moment(reg.data_nascimento).format("YYYY-MM-DD");

        res.render("leitor/view/vwFRUDrLeitor.njk", {
          title: "Edição de Leitor",
          data: reg,
          disabled: false,
          username: username
        });
      } else {
        console.log("[updateLeitor] Leitor não encontrado.");
        res.redirect("/leitor/manutLeitor");
      }
    } else {
      
      const regData = req.body;
      
      const idBody = parseInt(regData.id);
      if (isNaN(idBody)) {
         return res.json({ status: "Error", msg: "ID inválido no envio." });
      }

      try {
        
        const response = await axios.post(
          process.env.SERVIDOR_BIBLIOTECA_BACK + "/updateLeitor",
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
        const msg = error.response ? error.response.data.mensagem : error.message;
        res.json({ status: "Error", msg: msg });
      }
    }
  } catch (error) {
    console.error('[updateLeitor] Erro:', error.message);
    
    if (req.method === "GET") {
       return res.redirect("/leitor/manutLeitor");
    }
    res.json({ status: "Error", msg: error.message });
  }
};

const deleteLeitor = async (req, res) => {
  const regData = req.body;
  const token = req.session.token;

  try {
    
    const idLeitor = parseInt(regData.id);

    if (isNaN(idLeitor) || idLeitor <= 0) {
      return res.json({ status: "Error", msg: "ID inválido para exclusão." });
    }

   const response = await axios.post(
      process.env.SERVIDOR_BIBLIOTECA_BACK + "/deleteLeitor",
      { id: idLeitor },
      axiosConfig(token)
    );

    res.json({
      status: response.data.status || "ok",
      msg: response.data.mensagem || "Removido com sucesso",
      data: response.data,
      erro: null,
    });

  } catch (error) {
    console.error('[deleteLeitor] Erro:', error.message);
    const msg = error.response ? error.response.data.mensagem : error.message;
    res.json({ status: "Error", msg: msg });
  }
};

module.exports = {
  manutLeitor,
  insertLeitor,
  viewLeitor,
  updateLeitor,
  deleteLeitor
};