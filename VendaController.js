const CarrinhoController = require('./CarrinhoController');

let vendas = [];
let proximoVendaId = 1;

class VendaController {
  static listar(req, res) {
    return res.status(200).json(vendas);
  }

  static finalizar(req, res) {
    const resumo = CarrinhoController.obterEstadoAtual();
    if (!resumo.itens || resumo.itens.length === 0) {
      return res.status(400).json({ error: 'Não é possível finalizar uma venda com o carrinho vazio.' });
    }

    const novaVenda = {
      id: proximoVendaId++,
      data: new Date().toISOString(),
      itens: resumo.itens,
      total: resumo.total,
      status: 'FINALIZADA'
    };

    vendas.push(novaVenda);
    CarrinhoController.esvaziarInternamente();

    return res.status(201).json({
      message: 'Venda finalizada com sucesso!',
      venda: novaVenda
    });
  }
}

module.exports = VendaController;