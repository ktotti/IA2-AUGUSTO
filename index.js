const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const produtoRouter = require('./router/ProdutoRouter');
const carrinhoRouter = require('./router/CarrinhoRouter');
const vendaRouter = require('./router/VendaRouter');

app.use('/produtos', produtoRouter);
app.use('/carrinho', carrinhoRouter);
app.use('/vendas', vendaRouter);

app.get('/', (req, res) => {
  res.json({ status: 'API rodando' });
});

app.use((err, req, res, next) => {
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});