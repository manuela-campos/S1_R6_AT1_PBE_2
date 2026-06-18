import { connection as pool } from "../config/db.js";

const produtoModel = {
    // Nós temos uma consulta para inserir informações na nossa tabela
    insert: async (pProduto) => {
        const sql = 'INSERT INTO produtos (id_categoria, nomeProduto, valorProduto, vinculoImagem, dataCad) VALUES (?,?,?,?,NOW());';
        const values = [pProduto.id_categoria, pProduto.nomeProduto, pProduto.valorProduto, pProduto.vinculoImagem, pProduto.dataCad ];
        const [rows] = await pool.query(sql, values);
        return rows;
    }, 

    //Aqui temos uma consulta para ver os dados que foram inseridos na tabela
    selectAll: async () => {
        const sql = 'SELECT p.idProduto, p.id_categoria, c.nome_categoria, p.nome_produto, p.valorProduto, p.vinculoImagem, p.dataCad FROM produtos p LEFT JOIN categorias c ON p.id_categoria = c.id_categoria ORDER BY p.idProduto DESC';
        const [rows] = await pool.query(sql);
        return rows;
    },
    selectById: async (id) => {
        const sql = `
            SELECT 
                FROM produtos WHERE idProduto = ?;
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },
    // Atuallizar o valor que deseja na tabela
      update: async (id, produto) => {
        const sql = `
            UPDATE produtos 
            SET 
                id_categoria = ?,
                nomeProduto = ?,
                valorProduto = ?,
                vinculoImagem = COALESCE(?, vinculoImagem)
            WHERE idProduto = ?
        `;
        // COALESCE mantém imagem antiga se não enviar nova
        const values = [
            produto.id_categoria,
            produto.nomeProduto,
            produto.valorProduto,
            produto.vinculoImagem,
            id
        ];
        const [rows] = await pool.query(sql, values);
        return rows;
      },
    delete: async () => {
        const sql = 'DELETE FROM produtos WHERE idProduto;';
        const [rows] = await pool.query(sql);
        return rows;
    },
};

export default produtoModel;