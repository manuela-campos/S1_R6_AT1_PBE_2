import express from 'express';
import produtoRoutes from './routes/produto.routes.js';
import path from 'path';
import 'dotenv/config';
import categoriaRoutes from './routes/categoria.routes.js';
import { initializeDatabase } from './config/db.js';

const app = express();

app.use(express.json());
// rota para ser disponibilizada para fazer dowload
app.use('/uplaods', express.static(path.resolve('uploads')));
app.use('/', produtoRoutes);
app.use('/', categoriaRoutes);


initializeDatabase().then(() => {
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Servidor rodando na porta ${process.env.SERVER_PORT}`);
    });
}).catch(err => {
    console.error("Erro ao inicializar o banco de dados:", err);
});