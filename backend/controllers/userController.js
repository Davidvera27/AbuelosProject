// backend/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');  // Requerido para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para autenticación JWT

// Crear un usuario (primer formulario)
const createUser = async (req, res) => {
  try {
    const { primer_nombre, segundo_nombre, apellidos, email, password } = req.body;

    // Verificar si el correo ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `El correo ${email} ya está registrado para ${existingUser.primer_nombre} ${existingUser.apellidos}` });
    }

    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      primer_nombre,
      segundo_nombre,
      apellidos,
      email,
      password: hashedPassword,  // Guardar la contraseña encriptada
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Devuelve el usuario creado
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Iniciar sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Verificar la contraseña usando bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Generar un token JWT si las credenciales son correctas
    const token = jwt.sign(
      { userId: user._id, cargo: user.cargo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Completar el perfil del usuario (segundo formulario)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userUpdates = req.body;

    // Encriptar contraseña si se está actualizando
    if (userUpdates.password) {
      const salt = await bcrypt.genSalt(10);
      userUpdates.password = await bcrypt.hash(userUpdates.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, userUpdates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(updatedUser); // Devuelve el usuario actualizado
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,  // Asegúrate de exportar la función loginUser
  updateUser,
  getUserById,
};
