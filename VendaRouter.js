const express = require('express');
const router = express.Router();
const VendaController = require('../Controller/VendaController');

router.get('/', VendaController.listar);
router.post('/finalizar', VendaController.finalizar);

module.exports = router;