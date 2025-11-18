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

  })();