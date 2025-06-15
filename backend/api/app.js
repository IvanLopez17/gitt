import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './api/utils/db.js';
import authRoutes from './api/routes/auth.js';
import ventasRoutes from './api/routes/ventas.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/', (req, res) => res.send('API de Agencia de Viajes'));

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
});import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './api/utils/db.js';
import authRoutes from './api/routes/auth.js';
import ventasRoutes from './api/routes/ventas.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/', (req, res) => res.send('API de Agencia de Viajes'));

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
});