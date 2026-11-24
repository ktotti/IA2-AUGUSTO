const ProdutoController = require('./ProdutoController');

let carrinho = [];

function montarResumoCarrinho() {
  const produtos = ProdutoController.obterListaInterna();
  const itensDetalhados = carrinho
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) return null;
      const subtotal = Number((produto.preco * item.quantidade).toFixed(2));
      return {
        produtoId: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: item.quantidade,
        subtotal
      };
    })
    .filter(Boolean);

  const total = Number(
    itensDetalhados.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)
  );

  return { itens: itensDetalhados, total };
}

class CarrinhoController {
  static obter(req, res) {
    return res.status(200).json(montarResumoCarrinho());
  }

  static adicionar(req, res) {
    const produtoId = Number(req.body.produtoId);
    const quantidade = req.body.quantidade !== undefined ? Number(req.body.quantidade) : 1;

    if (!produtoId || Number.isNaN(produtoId)) {
      return res.status(400).json({ error: 'produtoId é obrigatório.' });
    }
    if (Number.isNaN(quantidade) || quantidade <= 0) {
      return res.status(400).json({ error: 'A quantidade deve ser maior que zero.' });
    }

    const produtos = ProdutoController.obterListaInterna();
    const produtoExiste = produtos.some((p) => p.id === produtoId);
    if (!produtoExiste) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const existente = carrinho.find((item) => item.produtoId === produtoId);
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      carrinho.push({ produtoId, quantidade });
    }

    return res.status(201).json(montarResumoCarrinho());
  }

  static atualizarQuantidade(req, res) {
    const produtoId = Number(req.params.produtoId);
    const quantidade = Number(req.body.quantidade);

    if (Number.isNaN(quantidade) || quantidade < 0) {
      return res.status(400).json({ error: 'Quantidade inválida.' });
    }

    const index = carrinho.findIndex((item) => item.produtoId === produtoId);
    if (index === -1) {
      return res.status(404).json({ error: 'Item não encontrado no carrinho.' });
    }

    if (quantidade === 0) {
      carrinho.splice(index, 1);
    } else {
      carrinho[index].quantidade = quantidade;
    }

    return res.status(200).json(montarResumoCarrinho());
  }

  static removerItem(req, res) {
    const produtoId = Number(req.params.produtoId);
    carrinho = carrinho.filter((item) => item.produtoId !== produtoId);
    return res.status(200).json(montarResumoCarrinho());
  }

  static limpar(req, res) {
    carrinho = [];
    return res.status(200).json(montarResumoCarrinho());
  }

  static obterEstadoAtual() {
    return montarResumoCarrinho();
  }

  static esvaziarInternamente() {
    carrinho = [];
  }
}

module.exports = CarrinhoController;