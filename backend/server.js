// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Configurar el servidor
const app = express();
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Rutas
app.use('/api', userRoutes); // Usamos las rutas de usuarios

// Puerto del servidor (usando la variable de entorno PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
