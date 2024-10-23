// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conexión a la base de datos de MongoDB utilizando las variables de entorno
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Para evitar advertencias de Mongoose
      useUnifiedTopology: true, // Para la correcta gestión de conexiones
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Manejo de errores de conexión y cierre del servidor si falla la conexión
    console.error(`Error: ${error.message}`);
    process.exit(1); // Cerrar el proceso si falla la conexión
  }
};

module.exports = connectDB;
