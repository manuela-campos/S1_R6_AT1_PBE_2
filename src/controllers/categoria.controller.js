import categoriaModel from "../models/categoria.model.js";

const validacoes = {
  // Verifica se o id é um inteiro válido
  isNumeroInteiro: (id) => {
    const numero = Number(id);
    return !isNaN(numero) && Number.isInteger(numero) && numero > 0;
  },
};
const categoriaController = {
  criar: async (req, res) => {
    try {
      console.log(req.body);

      const { nome_categoria } = req.body;

      // Verificar se o nome está vazio e remover qualquer espaço em branco iniciais ou finais
      if (nome_categoria.trim().lenght === 0) {
        return res
          .status(400)
          .json({ message: "O campo descrição da categoria está vazio" });
      }

      // Vai funcionar da seguinte forma é onde vai preparar o objeto para salvar os valores
      const novaCategoria = {
        nome_categoria: nome_categoria.trim(), // remove os espaços desnecessários declarados no início e/ou no final de uma string.
      };

      // Salva no banco
      const resultado = await categoriaModel.insertCategoria(novaCategoria);

      res.status(201).json({ message: "Categoria inserida com sucesso" });
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
    console.log(req.body);
      const { id_categoria } = req.params;
      const { nome_categoria } = req.body;
      

      // Verificar se a descrição está vazia e remover qualquer espaço em branco iniciais ou finais
      if (nome_categoria.trim().lenght === 0) {
        return res
          .status(400)
          .json({ message: "O campo descrição da categoria está vazio" });
      }

      // verificar se o produto já existe
      const categoriaAtual =
        await categoriaModel.selectById(nome_categoria);
      if (categoriaAtual === 1) {
        return res
          .status(409)
          .json({ message: "Essa categoria já existe, tente novamente!" });
      }
      const resultado = await categoriaAtual.update(
        id_categoria,
        descricaoCategoria
      );

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
      const result = await categoriaModel.selectCategoria();
      res.status(200).json({ data: result });

      console.log(result);

      // Verifica se a consulta é retornada
      const resultado = await categoriaModel.selectCategoria();
      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: `A consulta não retornou resultados` });
      }
      res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  buscarPorId: async (req, res) => {
    try {
      const { id_categoria } = req.params;

      if (!validacoes.isInteger(id_categoria)) {
        return res.status(400).json({ message: "ID inválido" });
      }
      const categoria = await categoriaModel.selectById(id_categoria);
      if (produto.length === 0) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }

      res.status(200).json({ data: categoria[0] });
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
      const idCategoria = Number(req.body.idCategoria);
      if (!idCategoria || !Number.isInteger(idCategoria)) {
        return res
          .status(400)
          .json({ message: `Forneça um identificador válido` });
      }
      const categoriaSelecionada = await categoriaModel.selectById(idCategoria);
      if (categoriaSelecionada.length === 0) {
        return res
          .status(200)
          .json({ message: `Categoria não localizada no banco de dados` });
      }
      const resultadoDelete = await categoriaModel.delete(idCategoria);
      if (resultadoDelete.affectedRows === 0) {
        return res
          .status(200)
          .json({ message: `Ocorreu um erro ao excluir a categoria` });
      }
      return res
        .status(200)
        .json({ message: `Categoria excluída com sucesso` });
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

export default categoriaController;
