const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const rateLimit = require('express-rate-limit');
const https = require('https'); // Importar https para crear un servidor HTTPS
const fs = require('fs'); // Módulo para trabajar con archivos del sistema

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Configurar el servidor
const app = express();
app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Limitar el número de intentos de inicio de sesión (Protección contra fuerza bruta)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limitar a 5 intentos
  message: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.',
});
app.use('/api/users/login', limiter);

// Rutas
app.use('/api', userRoutes);

// Puerto del servidor (HTTP en localhost, HTTPS en producción)
const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;

// Configurar HTTPS en producción
if (process.env.NODE_ENV === 'production') {
  // Cargar los archivos de los certificados SSL
  const httpsOptions = {
    key: fs.readFileSync('/ruta/a/tu/clave_privada.pem'),      // Ruta al archivo de clave privada
    cert: fs.readFileSync('/ruta/a/tu/certificado.pem'),       // Ruta al archivo de certificado
    ca: fs.readFileSync('/ruta/a/tu/fullchain.pem'),           // Ruta al archivo del certificado intermedio (opcional)
  };

  // Crear servidor HTTPS
  https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
    console.log(`Servidor HTTPS corriendo en el puerto ${HTTPS_PORT}`);
  });
} else {
  // En desarrollo, usa HTTP
  app.listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en el puerto ${PORT}`);
  });
}
