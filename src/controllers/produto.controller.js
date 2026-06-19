import produtoModel from "../models/produto.model.js";

const validacoes = {
  // Verifica se o id é um inteiro válido
  isNumeroInteiro: (id) => {
    const numero = Number(id);
    return !isNaN(numero) && Number.isInteger(numero) && numero > 0;
  },

  // Verifica se é número decimal válido (preço)
  isValorDecimal: (preco) => {
    const numero = parseFloat(preco);
    return !isNaN(numero) && numero >= 0;
  },
};
const produtoController = {
  criar: async (req, res) => {
    try {
      console.log(req.body);
      
      const { id_categoria, nomeProduto, valorProduto } = req.body;

      // verifica se o nome do arquivo foi enviado a imagem
      const vinculoImagem = req.file ? req.file.filename : null;

      // tratamento do id_categoria e valor do produto
      if (!validacoes.isNumeroInteiro(id_categoria)) {
        return res
          .status(400)
          .json({
            message: "ID da categoria deve ser um número inteiro válido",
          });
      }
      if (!validacoes.isValorDecimal(valorProduto)) {
        return res
          .status(400)
          .json({ message: "Valor do produto deve ser um número válido" });
      }
      // Verificar se o nome está vazio e remover qualquer espaço em branco iniciais ou finais
      if (nomeProduto.trim().lenght === 0) {
        return res
          .status(400)
          .json({ message: "O campo nome do produto está vazio" });
      }

      // Vai funcionar da seguinte forma é onde vai preparar o objeto para salvar os valores
      const novoProduto = {
        id_categoria: parseInt(id_categoria),
        nomeProduto: nomeProduto.trim(), // remove os espaços desnecessários declarados no início e/ou no final de uma string.
        valorProduto: parseFloat(valorProduto).toFixed(2),
        vinculoImagem: vinculoImagem,
      };

      // Salva no banco
      const resultado = await produtoModel.insert(novoProduto);

      res.status(201).json({ message: "Produto inserido com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  editar: async (req, res) => {
    try {
      const { idProduto } = req.params;
      const { id_categoria, nomeProduto, valorProduto } = req.body;
      const vinculoImagem = req.file ? req.file.filename : null;

      // Verificar se o nome está vazio e remover qualquer espaço em branco iniciais ou finais
      if (nomeProduto.trim().lenght === 0) {
        return res
          .status(400)
          .json({ message: "O campo nome do produto está vazio" });
      }
      // Valida ID do produto
      if (!validacoes.isNumeroInteiro(idProduto)) {
        return res.status(400).json({ message: "ID do produto inválido" });
      }
      // tratamento do id_categoria e valor do produto
      if (!validacoes.isNumeroInteiro(id_categoria)) {
        return res
          .status(400)
          .json({
            message: "ID da categoria deve ser um número inteiro válido",
          });
      }
      if (!validacoes.isValorDecimal(valorProduto)) {
        return res
          .status(400)
          .json({ message: "Valor do produto deve ser um número válido" });
      }
      // verificar se o produto já existe
      const nomeProdutoAtual = await produtoModel.selectById(nomeProduto);
      if (nomeProdutoAtual === 1) {
        return res
          .status(409)
          .json({ message: "Esse produto já existe, tente novamente!" });
      }
      const resultado = await produtoModel.update(idProduto, dadosAtualizados);

      if (resultado.affectedRows === 0) {
        return res.status(400).json({ message: "Nenhuma alteração realizada" });
      }

      res.status(200).json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  listarTodos: async (req, res) => {
    try {
      const result = await produtoModel.selectAll();
      res.status(200).json({ data: result });

      // Verifica se a consulta é retornada
      const resultado = await produtoModel.selectAll();
      if (resultado.length === 0) {
        return res
          .status(404)
          .json({ message: `A consulta não retornou resultados` });
      }
      res.status(200).json({
        // quantidade: resultado.length,
        // data: resultado,
        data: resultado
      });
    }  catch (error) {
    return res.status(500).json({
      message: "Erro ao listar produtos",
      error: error.message
    });
  }
},
  buscarPorId: async (req, res) => {
    try {
      const { idProduto } = req.params;

      if (!validacoes.isInteger(idProduto)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      const produto = await produtoModel.selectById(idProduto);
      if (produto.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.status(200).json({ data: produto[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  excluirProduto: async (req, res) => {
    try {
      const idProduto = Number(req.body.idProduto);
      if (!idProduto || !Number.isInteger(idProduto)) {
        return res
          .status(400)
          .json({ message: `Forneça um identificador válido` });
      }
      const produtoSelecionado = await produtoModel.selectById(idProduto);
      if (produtoSelecionado.length === 0) {
        return res
          .status(200)
          .json({ message: `Produto não localizado no banco de dados` });
      }
      const resultadoDelete = await produtoModel.delete(idProduto);
      if (resultadoDelete.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: `Ocorreu um erro ao excluir o produto` });
      }
      return res.status(200).json({ message: `Produto excluído com sucesso` });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  upload: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Arquivo não enviado" });
      }
      res.status(200).json({
        message: "Upload realizdo com sucesso",
        // file: {
        //   filename: req.files.filename,
        //   size: req.files.size,
        //   mimetype: req.files.mimetype,
        // },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorre um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
};

export default produtoController;
