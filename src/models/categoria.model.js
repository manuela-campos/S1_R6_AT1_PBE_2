import { connection as pool } from "../config/db.js"; 

const categoriaModel = {
  insertCategoria: async (cCategoria) => {
    const sql =
      "INSERT INTO categorias (nome_categoria, dataCad) VALUES (?, NOW());";
    const values = [cCategoria.nome_categoria, cCategoria.dataCad];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  selectCategoria: async () => {
    const sql = 'SELECT * FROM categorias';
    const [rows] = await pool.query(sql);
    return rows;
  },
  selectById: async (id) => {
        const sql = `
            SELECT 
                c.id_categoria,
                c.nome_categoria,
                c.dataCad
            FROM categorias
            WHERE c.id_categoria = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },
    // Atuallizar o valor que deseja na tabela
    update: async (id, nome_categoria) => {
        const sql = `
            UPDATE categoria 
            SET 
                id_categoria = ?,
                nome_categoria = ?
            WHERE id_categoria = ?
        `;
        // COALESCE mantém imagem antiga se não enviar nova
        const values = [
            id,
            nome_categoria
        ];
        const [rows] = await pool.query(sql, values);
        return rows;
      },
    delete: async () => {
        const sql = 'DELETE FROM categorias WHERE id_categoria;';
        const [rows] = await pool.query(sql);
        return rows;
    },
};

export default categoriaModel;

