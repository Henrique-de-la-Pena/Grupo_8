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

  })();