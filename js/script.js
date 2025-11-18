// js/app.js

(function () {
  // Chaves usadas no localStorage
  const STORAGE_KEYS = {
    ESTOQUE: "mn_estoque",
    VENDAS: "mn_vendas",
    VENDA_ATUAL: "mn_venda_atual",
    NOME_LOJA: "mn_nome_loja",
    FILTRO_RELATORIO: "mn_filtro_relatorio",
  };

  // ---------- FUNÇÕES GERAIS DE STORAGE ----------

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

  // Faz um "seed" inicial no estoque na primeira vez que o usuário entra
  function garantirEstoqueInicial() {
    const estoque = carregarEstoque();
    if (estoque.length > 0) return;

    const inicial = [
    ];
    salvarEstoque(inicial);
  }

  // Gera um ID simples
  function gerarId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Converte texto tipo "R$10,00" em número 10.00
  function parsePreco(texto) {
    if (typeof texto !== "string") return 0;
    const limpo = texto.replace("R$", "").replace(".", "").replace(",", ".").trim();
    const num = parseFloat(limpo);
    return isNaN(num) ? 0 : num;
  }

  // Formata número 12.5 -> "R$12,50"
  function formatarPreco(valor) {
    return "R$" + valor.toFixed(2).replace(".", ",");
  }

  // Atualiza o <h1> com o nome salvo da loja
  function aplicarNomeLoja() {
    const h1 = document.querySelector("header h1");
    if (!h1) return;
    h1.textContent = carregarNomeLoja();
  }

  // ---------- PÁGINA: INDEX.HTML ----------

  function initIndex() {
    // Aqui por enquanto só aplicamos o nome da loja.
    // Se quiser, depois a gente coloca resumos (total de produtos, etc.).
  }

  // ---------- PÁGINA: CONTROLEDEESTOQUE.HTML ----------

function renderizarListaEstoque() {
  const ul = document.querySelector("main .lista ul");
  if (!ul) return;

  const estoque = carregarEstoque();

  // só produtos com quantidade > 0
  const disponiveis = estoque.filter((produto) => produto.quantidade > 0);

  ul.innerHTML = "";

  if (disponiveis.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum produto em estoque.";
    ul.appendChild(li);
    return;
  }

  disponiveis.forEach((produto) => {
    const li = document.createElement("li");
    li.textContent = `X ${produto.quantidade} - ${produto.nome}`;
    ul.appendChild(li);
  });
}

function initControleDeEstoque() {
  garantirEstoqueInicial();   // se quiser manter o seed (mesmo que hoje esteja vazio)
  renderizarListaEstoque();   // monta a lista com filtro de quantidade > 0
}


  // ---------- PÁGINA: CDE01.HTML (Adicionar Produtos) ----------

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

      // limpa os campos
      inputNome.value = "";
      inputQtd.value = "";
      inputPreco.value = "";

      // volta para a tela de controle de estoque
      window.location.href = "controledeestoque.html";
    });
  }

  // ---------- PÁGINA: REGISTRARVENDAS.HTML ----------

  function atualizarEstoqueAposVenda(venda) {
    let estoque = carregarEstoque();
    let alterou = false;

    venda.itens.forEach((itemVenda) => {
      const produto = estoque.find((p) => p.nome === itemVenda.nome);
      if (!produto) return;
      produto.quantidade = Math.max(0, produto.quantidade - itemVenda.quantidade);
      alterou = true;
    });

    if (alterou) salvarEstoque(estoque);
  }

function renderListaProdutosVenda(ul) {
  const estoque = carregarEstoque();

  // Só mostra produtos com quantidade > 0
  const disponiveis = estoque.filter((p) => p.quantidade > 0);

  ul.innerHTML = "";

  if (disponiveis.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhum produto em estoque para vender.";
    ul.appendChild(li);
    return;
  }

  disponiveis.forEach((produto) => {
    const li = document.createElement("li");

    const inputQtd = document.createElement("input");
    inputQtd.size = 1;
    inputQtd.classList.add("controle");
    inputQtd.type = "number";
    inputQtd.min = "0";
    inputQtd.value = "";

    const divNome = document.createElement("div");
    divNome.textContent = produto.nome;

    const divPreco = document.createElement("div");
    divPreco.textContent = formatarPreco(produto.preco);

    li.appendChild(inputQtd);
    li.appendChild(divNome);
    li.appendChild(divPreco);

    ul.appendChild(li);
  });
}

function initRegistrarVendas() {
  const main = document.querySelector("main");
  if (!main) return;

  const ul = main.querySelector(".adproduto ul");
  const btnEncerrar = main.querySelector(".confirmar");

  if (!ul || !btnEncerrar) return;

  // Monta a lista de produtos em estoque
  garantirEstoqueInicial(); // se quiser manter o seed
  renderListaProdutosVenda(ul);

  btnEncerrar.addEventListener("click", function (event) {
    event.preventDefault();

    const estoque = carregarEstoque();  // vamos conferir contra o estoque real
    const itensLi = Array.from(ul.querySelectorAll("li"));
    const itensVenda = [];
    let totalVenda = 0;

    let erroEstoque = null; // se algum produto passar do limite, guardamos aqui

    itensLi.forEach((li) => {
      const inputQtd = li.querySelector("input");
      const divs = li.querySelectorAll("div");
      if (!inputQtd || divs.length < 2) return;

      const qtd = parseInt(inputQtd.value, 10) || 0;
      if (qtd <= 0) return; // ignora produtos com quantidade 0

      const nome = divs[0].textContent.trim();        // nome do produto
      const precoUnitario = parsePreco(divs[1].textContent);

      // 🔎 procura esse produto no estoque
      const produtoEstoque = estoque.find((p) => p.nome === nome);
      const disponivel = produtoEstoque ? produtoEstoque.quantidade : 0;

      // ❌ se pediu mais do que tem, marca erro e nem monta itensVenda
      if (qtd > disponivel && !erroEstoque) {
        erroEstoque = {
          nome,
          disponivel,
          solicitado: qtd,
        };
        return;
      }

      const subtotal = precoUnitario * qtd;

      itensVenda.push({
        nome: nome,
        quantidade: qtd,
        precoUnitario: precoUnitario,
        subtotal: subtotal,
      });

      totalVenda += subtotal;
    });

    // Se teve algum erro de estoque, avisa e cancela a venda
    if (erroEstoque) {
      alert(
        `Quantidade indisponível para o produto "${erroEstoque.nome}".\n` +
        `Disponível em estoque: ${erroEstoque.disponivel}\n` +
        `Você tentou vender: ${erroEstoque.solicitado}`
      );
      return;
    }

    if (itensVenda.length === 0) {
      alert("Informe pelo menos a quantidade de um produto.");
      return;
    }

    const vendas = carregarVendas();
    const novaVenda = {
      id: gerarId(),
      data: new Date().toISOString(),
      itens: itensVenda,
      total: totalVenda,
    };

    vendas.push(novaVenda);
    salvarVendas(vendas);

    // Salva venda atual para o resumo em reg01.html
    salvarJson(STORAGE_KEYS.VENDA_ATUAL, novaVenda);

    // Atualiza o estoque tirando os produtos vendidos
    atualizarEstoqueAposVenda(novaVenda);

    // Vai para a tela de resumo da venda
    window.location.href = "reg01.html";
  });
}


  // ---------- PÁGINA: REG01.HTML (Resumo da Venda) ----------

  function initReg01() {
    const main = document.querySelector("main");
    if (!main) return;

    const vendaAtual = carregarJson(STORAGE_KEYS.VENDA_ATUAL, null);
    if (!vendaAtual) {
      // se não tiver venda atual, não mexe na tela
      return;
    }

    const ul = main.querySelector(".adproduto ul");
    const divTotal = main.querySelector(".adproduto .total");

    if (!ul || !divTotal) return;

    ul.innerHTML = "";

    vendaAtual.itens.forEach((item) => {
      const li = document.createElement("li");

      const divQtd = document.createElement("div");
      divQtd.textContent = `${item.quantidade}X`;

      const divNome = document.createElement("div");
      divNome.textContent = item.nome;

      const divPreco = document.createElement("div");
      divPreco.textContent = formatarPreco(item.subtotal);

      li.appendChild(divQtd);
      li.appendChild(divNome);
      li.appendChild(divPreco);
      ul.appendChild(li);
    });

    divTotal.textContent = "Total: " + formatarPreco(vendaAtual.total);
  }

  function atualizarEstoqueAposVenda(venda) {
    let estoque = carregarEstoque();
    let alterou = false;

    venda.itens.forEach((itemVenda) => {
        // Procura o produto pelo NOME

    const produto = estoque.find((p) => p.nome === itemVenda.nome);
    if (!produto) {
        console.warn("Produto vendido não encontrado no estoque:", itemVenda.nome);
        return;
    }

    // Diminui a quantidade
    produto.quantidade -= itemVenda.quantidade;

    // Se quiser impedir negativo:
    if (produto.quantidade < 0) {
    produto.quantidade = 0;
    }

    alterou = true;
});

if (alterou) {
    salvarEstoque(estoque);
}
}


  // ---------- PÁGINA: RELATORIOS.HTML ----------

  function initRelatorios() {
    const main = document.querySelector("main");
    if (!main) return;

    const select = main.querySelector(".selecionar select, .selecionar .botao");
    const btnVer = main.querySelector(".confirmar");

    if (!select || !btnVer) return;

    btnVer.addEventListener("click", function (event) {
      event.preventDefault();
      const valor = (select.value || select.textContent || "").trim();
      localStorage.setItem(STORAGE_KEYS.FILTRO_RELATORIO, valor);
      window.location.href = "rel01.html";
    });
  }

  // ---------- PÁGINA: REL01.HTML (Relatório) ----------

  function filtrarVendasPorPeriodo(vendas, filtroTexto) {
    if (!filtroTexto) return vendas;

    const agora = new Date();
    const msDia = 24 * 60 * 60 * 1000;

    function dentroDosUltimosDias(venda, dias) {
      const data = new Date(venda.data);
      const diff = agora - data;
      return diff >= 0 && diff <= dias * msDia;
    }

    const filtro = filtroTexto.toLowerCase();

    if (filtro.includes("hoje")) {
      return vendas.filter((v) => {
        const d = new Date(v.data);
        return (
          d.getDate() === agora.getDate() &&
          d.getMonth() === agora.getMonth() &&
          d.getFullYear() === agora.getFullYear()
        );
      });
    } else if (filtro.includes("semana")) {
      return vendas.filter((v) => dentroDosUltimosDias(v, 7));
    } else if (filtro.includes("mês")) {
      return vendas.filter((v) => dentroDosUltimosDias(v, 30));
    } else if (filtro.includes("60")) {
      return vendas.filter((v) => dentroDosUltimosDias(v, 60));
    } else if (filtro.includes("90")) {
      return vendas.filter((v) => dentroDosUltimosDias(v, 90));
    }

    // Se não reconheceu, retorna todas
    return vendas;
  }

  function initRel01() {
    const main = document.querySelector("main");
    if (!main) return;

    const vendas = carregarVendas();
    const filtro = localStorage.getItem(STORAGE_KEYS.FILTRO_RELATORIO) || "";
    const vendasFiltradas = filtrarVendasPorPeriodo(vendas, filtro);

    const cabRelatorio = main.querySelector(".cabrelatorio");
    const ulMaisVendidos = main.querySelector(".lista ul");
    const divEstoqueBaixo = main.querySelector(".prodestoque");
    const divTotal = main.querySelector(".total");

    if (cabRelatorio && filtro) {
      cabRelatorio.textContent = `Relatório - ${filtro}`;
    }

    // Monta "Produtos mais vendidos"
    if (ulMaisVendidos) {
      ulMaisVendidos.innerHTML = "";

      const mapaProdutos = new Map(); // nome -> {quantidade, receita}

      vendasFiltradas.forEach((venda) => {
        venda.itens.forEach((item) => {
          if (!mapaProdutos.has(item.nome)) {
            mapaProdutos.set(item.nome, { quantidade: 0, receita: 0 });
          }
          const atual = mapaProdutos.get(item.nome);
          atual.quantidade += item.quantidade;
          atual.receita += item.subtotal;
        });
      });

      const listaOrdenada = Array.from(mapaProdutos.entries()).sort(
        (a, b) => b[1].quantidade - a[1].quantidade
      );

      if (listaOrdenada.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Nenhuma venda nesse período.";
        ulMaisVendidos.appendChild(li);
      } else {
        listaOrdenada.forEach(([nome, dados]) => {
          const li = document.createElement("li");
          const divNome = document.createElement("div");
          const divQtd = document.createElement("div");

          divNome.textContent = nome;
          divQtd.textContent = `${dados.quantidade}X`;

          li.appendChild(divNome);
          li.appendChild(divQtd);
          ulMaisVendidos.appendChild(li);
        });
      }
    }

    // Estoque baixo (usa estoque atual)
    if (divEstoqueBaixo) {
      const estoque = carregarEstoque();
      const criticos = estoque.filter((p) => p.quantidade <= 1);

      if (criticos.length === 0) {
        divEstoqueBaixo.textContent = "Nenhum produto com estoque baixo.";
      } else {
        const texto = criticos
          .map((p) => `${p.nome} - ${p.quantidade}X`)
          .join(" | ");
        divEstoqueBaixo.textContent = texto;
      }
    }

    // Receita total
    if (divTotal) {
      const receita = vendasFiltradas.reduce((soma, v) => soma + v.total, 0);
      divTotal.textContent = "Receita Total: " + formatarPreco(receita);
    }
  }

  // ---------- PÁGINAS: PERFIL.HTML / SETTINGS.HTML (extra simples) ----------

  function initPerfil() {
    // Por enquanto só deixamos o nome da loja no <h1>.
    // Se depois você quiser deixar nome e endereço dinâmicos, dá pra puxar de localStorage também.
  }

  function initSettings() {
    // Sugestão futura:
    // - criar um input para alterar o nome da loja
    // - ao salvar, chamar salvarNomeLoja(novoNome)
    // - e usar aplicarNomeLoja() nas páginas
  }

  // ---------- INICIALIZAÇÃO GERAL ----------

  function initApp() {
    aplicarNomeLoja();

    const pagina = location.pathname.split("/").pop();

    switch (pagina) {
      case "":
      case "index.html":
        initIndex();
        break;
      case "controledeestoque.html":
        initControleDeEstoque();
        break;
      case "cde01.html":
        initCDE01();
        break;
      case "registrarvendas.html":
        initRegistrarVendas();
        break;
      case "reg01.html":
        initReg01();
        break;
      case "relatorios.html":
        initRelatorios();
        break;
      case "rel01.html":
        initRel01();
        break;
      case "perfil.html":
        initPerfil();
        break;
      case "settings.html":
        initSettings();
        break;
      default:
        // nada
        break;
    }
  }

  document.addEventListener("DOMContentLoaded", initApp);
})();
