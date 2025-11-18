(function () {
  const STORAGE_KEYS = {
    ESTOQUE: "mn_estoque",
    VENDAS: "mn_vendas",
    VENDA_ATUAL: "mn_venda_atual",
    NOME_LOJA: "mn_nome_loja",
    FILTRO_RELATORIO: "mn_filtro_relatorio",
  };

  function carregarJson(chave, padrao) {
    try {
      const valor = localStorage.getItem(chave);
      if (!valor) return padrao;
      return JSON.parse(valor);
    } catch (e) {
      console.error("Erro ao carregar", chave, e);
      return padrao;
    }
  }

  function salvarJson(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (e) {
      console.error("Erro ao salvar", chave, e);
    }
  }

  function carregarEstoque() {
    return carregarJson(STORAGE_KEYS.ESTOQUE, []);
  }

  function salvarEstoque(estoque) {
    salvarJson(STORAGE_KEYS.ESTOQUE, estoque);
  }

  function carregarVendas() {
    return carregarJson(STORAGE_KEYS.VENDAS, []);
  }

  function salvarVendas(vendas) {
    salvarJson(STORAGE_KEYS.VENDAS, vendas);
  }

  function carregarNomeLoja() {
    return localStorage.getItem(STORAGE_KEYS.NOME_LOJA) || "Meu Negócio";
  }

  function salvarNomeLoja(nome) {
    localStorage.setItem(STORAGE_KEYS.NOME_LOJA, nome);
  }

  function garantirEstoqueInicial() {
    const estoque = carregarEstoque();
    if (estoque.length > 0) return;

    const inicial = [
      { id: 1, nome: "Pão de Forma", quantidade: 10, preco: 8.0 },
      { id: 2, nome: "Cartela de Ovo", quantidade: 7, preco: 7.0 },
      { id: 3, nome: "Geleia de Morango", quantidade: 5, preco: 10.0 },
      { id: 4, nome: "Pacotes de Macarrão", quantidade: 3, preco: 6.0 },
    ];
    salvarEstoque(inicial);
  }

  function gerarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  function parsePreco(texto) {
    if (typeof texto !== "string") return 0;
    const limpo = texto.replace("R$", "").replace(".", "").replace(",", ".").trim();
    const num = parseFloat(limpo);
    return isNaN(num) ? 0 : num;
  }

  function formatarPreco(valor) {
    return "R$" + valor.toFixed(2).replace(".", ",");
  }

// Controle de Estoque

  function renderizarListaEstoque() {
    const ul = document.querySelector("main .lista ul");
    if (!ul) return;

    const estoque = carregarEstoque();

    ul.innerHTML = "";

    if (estoque.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhum produto cadastrado.";
      ul.appendChild(li);
      return;
    }

    estoque.forEach((produto) => {
      const li = document.createElement("li");
      li.textContent = `X ${produto.quantidade} - ${produto.nome}`;
      ul.appendChild(li);
    });
  }

  function initControleDeEstoque() {
    garantirEstoqueInicial();
    renderizarListaEstoque();
  }

  // CDE
  function initCDE01() {
    const main = document.querySelector("main");
    if (!main) return;

    const inputNome = main.querySelector(".adproduto .digitar input");
    const inputQtd = main.querySelector(".quantidade input");
    const inputPreco = main.querySelector(".preço input");
    const btnConfirmar = main.querySelector(".confirmar");

    if (!inputNome || !inputQtd || !inputPreco || !btnConfirmar) return;

    btnConfirmar.addEventListener("click", function (event) {
      event.preventDefault();

      const nome = (inputNome.value || "").trim();
      const qtd = parseInt(inputQtd.value, 10);
      const preco = parsePreco(inputPreco.value);

      if (!nome) {
        alert("Digite o nome do produto.");
        return;
      }
      if (isNaN(qtd) || qtd <= 0) {
        alert("Informe uma quantidade válida (maior que 0).");
        return;
      }
      if (isNaN(preco) || preco < 0) {
        alert("Informe um preço válido.");
        return;
      }

      const estoque = carregarEstoque();
      estoque.push({
        id: gerarId(),
        nome: nome,
        quantidade: qtd,
        preco: preco,
      });
      salvarEstoque(estoque);

      alert("Produto cadastrado com sucesso!");

      inputNome.value = "";
      inputQtd.value = "";
      inputPreco.value = "";

      window.location.href = "controledeestoque.html";
    });
  }

  })();