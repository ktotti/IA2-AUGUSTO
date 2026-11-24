const express = require('express');
const router = express.Router();
const CarrinhoController = require('../Controller/CarrinhoController');

router.get('/', CarrinhoController.obter);
router.post('/adicionar', CarrinhoController.adicionar);
router.put('/item/:produtoId', CarrinhoController.atualizarQuantidade);
router.delete('/item/:produtoId', CarrinhoController.removerItem);
router.delete('/limpar', CarrinhoController.limpar);

module.exports = router;