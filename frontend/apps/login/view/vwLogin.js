async function vwLogin() {
  const form = document.getElementById("formLogin");

  // Coletando os dados do formulário manualmente (sem FormData)
  const formData = {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  // Executa validação
  if (!Validar(formData)) {
    return false;
  }

  try {
    // Envia JSON ao servidor
    const resp = await axios.post("/login", formData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!resp || resp.data.status !== "ok") {
      alert("Erro inesperado no login.");
      return;
    }

    // Login ok → cria cookie
    Cookies.set("isLogged", true, { sameSite: "strict" });

    // Redireciona para página inicial
    window.open("/", "_self");

  } catch (error) {
    // Tratamento de erros retornados pelo servidor
    if (error.response && error.response.data && error.response.data.msg) {
      alert("Erro: " + error.response.data.msg);
    } else {
      alert("Erro desconhecido ao fazer login.");
    }
  }
}
