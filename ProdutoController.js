const fs = require('fs');
const path = require('path');
const Produto = require('../model/Produto');

let produtos = [];
let proximoId = 1;

function validarPreco(preco) {
  const valor = Number(preco);
  if (preco === undefined || preco === null || preco === '' || Number.isNaN(valor)) {
    return 'Preço inválido.';
  }
  if (valor < 0) {
    return 'O preço não pode ser negativo.';
  }
  return null;
}

function apagarImagemAntiga(imagemUrl) {
  if (!imagemUrl) return;
  const nomeArquivo = path.basename(imagemUrl);
  const caminhoArquivo = path.join(__dirname, '..', 'uploads', nomeArquivo);
  if (fs.existsSync(caminhoArquivo)) {
    fs.unlinkSync(caminhoArquivo);
  }
}

class ProdutoController {
  static listar(req, res) {
    return res.status(200).json(produtos);
  }

  static buscarPorId(req, res) {
    const id = Number(req.params.id);
    const produto = produtos.find((p) => p.id === id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }
    return res.status(200).json(produto);
  }

  static criar(req, res) {
    try {
      const { nome, preco, descricao } = req.body;
      const erroPreco = validarPreco(preco);
      if (erroPreco) {
        if (req.file) apagarImagemAntiga(req.file.filename);
        return res.status(400).json({ error: erroPreco });
      }

      const imagemPath = req.file ? `/uploads/${req.file.filename}` : null;

      const novoProduto = new Produto({
        id: proximoId++,
        nome,
        preco,
        descricao,
        imagem: imagemPath
      });

      produtos.push(novoProduto);
      return res.status(201).json(novoProduto);
    } catch (err) {
      if (req.file) apagarImagemAntiga(req.file.filename);
      return res.status(400).json({ error: err.message });
    }
  }

  static atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const index = produtos.findIndex((p) => p.id === id);
      if (index === -1) {
        if (req.file) apagarImagemAntiga(req.file.filename);
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      const atual = produtos[index];
      const nome = req.body.nome !== undefined ? req.body.nome : atual.nome;
      const preco = req.body.preco !== undefined ? req.body.preco : atual.preco;
      const descricao = req.body.descricao !== undefined ? req.body.descricao : atual.descricao;

      const erroPreco = validarPreco(preco);
      if (erroPreco) {
        if (req.file) apagarImagemAntiga(req.file.filename);
        return res.status(400).json({ error: erroPreco });
      }

      let novaImagem = atual.imagem;
      if (req.file) {
        apagarImagemAntiga(atual.imagem);
        novaImagem = `/uploads/${req.file.filename}`;
      }

      const produtoAtualizado = new Produto({
        id: atual.id,
        nome,
        preco,
        descricao,
        imagem: novaImagem
      });

      produtos[index] = produtoAtualizado;
      return res.status(200).json(produtoAtualizado);
    } catch (err) {
      if (req.file) apagarImagemAntiga(req.file.filename);
      return res.status(400).json({ error: err.message });
    }
  }

  static excluir(req, res) {
    const id = Number(req.params.id);
    const index = produtos.findIndex((p) => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const [removido] = produtos.splice(index, 1);
    apagarImagemAntiga(removido.imagem);
    return res.status(200).json({ message: 'Produto removido com sucesso.', produto: removido });
  }

  static obterListaInterna() {
    return produtos;
  }
}

module.exports = ProdutoController;