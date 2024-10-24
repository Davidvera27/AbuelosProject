// backend/controllers/userController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');  // Encriptar contraseñas
const jwt = require('jsonwebtoken'); // Autenticación JWT

// Crear un usuario
const createUser = async (req, res) => {
  try {
    const { primer_nombre, apellidos, email, password } = req.body;

    // Validaciones adicionales en el backend
    if (!primer_nombre || !apellidos || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    if (!/^[A-Za-z\s]+$/.test(primer_nombre)) {
      return res.status(400).json({ message: 'El primer nombre solo puede contener letras y espacios' });
    }
    if (!/^[A-Za-z\s]+$/.test(apellidos)) {
      return res.status(400).json({ message: 'Los apellidos solo pueden contener letras y espacios' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'El formato del correo electrónico es inválido' });
    }

    // Verificar si el correo ya está en uso
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `El correo ${email} ya está registrado` });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      primer_nombre,
      apellidos,
      email,
      password: hashedPassword,  // Guardar contraseña encriptada
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Usuario creado exitosamente
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Iniciar sesión
// Función para manejar el inicio de sesión
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar al usuario en la base de datos por correo electrónico
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Comparar la contraseña ingresada con la contraseña encriptada almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // Si las credenciales son correctas, generar un token de autenticación
    const token = jwt.sign(
      { userId: user._id, cargo: user.cargo }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Devolver el token al frontend para que lo almacene
    res.json({ token, message: 'Inicio de sesión exitoso' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar usuario
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

    res.status(200).json(updatedUser); // Usuario actualizado
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener usuario por ID
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
  loginUser,
  updateUser,
  getUserById,
};
