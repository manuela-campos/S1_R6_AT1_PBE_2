import { connection as pool } from "../config/db.js"; 

const categoriaModel = {
  insertCategoria: async (cCategoria) => {
    const sql =
      "INSERT INTO categoria (descricaoCategoria,dataCad) VALUES (?, NOW());";
    const values = [cCategoria.descricaoCategoria, cCategoria.dataCad];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  selectCategoria: async () => {
    const sql = 'SELECT * FROM categoria';
    const [rows] = await pool.query(sql);
    return rows;
  },
  selectById: async (id) => {
        const sql = `
            SELECT 
                c.id_categoria,
                c.descricaoCategoria,
                c.dataCad
            FROM categoria
            WHERE c.id_categoria = ?
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },
    // Atuallizar o valor que deseja na tabela
    update: async (id, descricaoCategoria) => {
        const sql = `
            UPDATE categoria 
            SET 
                id_categoria = ?,
                descricaoCategoria = ?
            WHERE id_categoria = ?
        `;
        // COALESCE mantém imagem antiga se não enviar nova
        const values = [
            id,
            descricaoCategoria
        ];
        const [rows] = await pool.query(sql, values);
        return rows;
      },
    delete: async () => {
        const sql = 'DELETE FROM categoria WHERE id_categoria;';
        const [rows] = await pool.query(sql);
        return rows;
    },
};

export default categoriaModel;

