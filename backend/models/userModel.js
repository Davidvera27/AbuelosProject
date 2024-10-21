// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  primer_nombre: { type: String, required: true },
  segundo_nombre: { type: String },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  edad: { type: Number },
  fecha_nacimiento: { type: Date },
  cargo: { type: String },
  especialidad: { type: String },
  no_documento: { type: String },
  tarjeta_profesional: { type: String },
  estado: { type: String },
  profesion: { type: String },
  telefono: { type: String },
  direccion: { type: String },
  foto_perfil: { type: String }, // Para guardar la URL de la imagen
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
