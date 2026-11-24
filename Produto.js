class Produto {
  constructor({ id, nome, preco, descricao = '', imagem = null }) {
    if (!nome || String(nome).trim() === '') {
      throw new Error('O nome do produto é obrigatório.');
    }

    const precoNumerico = Number(preco);
    if (Number.isNaN(precoNumerico) || precoNumerico < 0) {
      throw new Error('O preço não pode ser negativo ou inválido.');
    }

    this.id = id;
    this.nome = String(nome).trim();
    this.preco = Number(precoNumerico.toFixed(2));
    this.descricao = String(descricao || '').trim();
    this.imagem = imagem || null;
  }
}

module.exports = Produto;