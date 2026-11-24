const express = require('express');
const router = express.Router();
const ProdutoController = require('../Controller/ProdutoController');
const upload = require('../middleware/upload');

router.get('/', ProdutoController.listar);
router.get('/:id', ProdutoController.buscarPorId);
router.post('/', upload.single('imagem'), ProdutoController.criar);
router.put('/:id', upload.single('imagem'), ProdutoController.atualizar);
router.delete('/:id', ProdutoController.excluir);

module.exports = router;