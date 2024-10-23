// backend/models/userModel.js
const mongoose = require('mongoose');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Middleware para encriptar la contraseña antes de guardar el usuario
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // Generar un "salt"
  this.password = await bcrypt.hash(this.password, salt); // Encriptar la contraseña
});

const User = mongoose.model('User', userSchema);
module.exports = User;
