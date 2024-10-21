// backend/controllers/userController.js
const User = require('../models/userModel');

// Crear un usuario (primer formulario)
const createUser = async (req, res) => {
  try {
    const { primer_nombre, segundo_nombre, apellidos, email, password } = req.body;

    const newUser = new User({
      primer_nombre,
      segundo_nombre,
      apellidos,
      email,
      password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser); // Devuelve el usuario creado
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Completar el perfil del usuario (segundo formulario)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userUpdates = req.body;
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
  updateUser,
  getUserById,
};
