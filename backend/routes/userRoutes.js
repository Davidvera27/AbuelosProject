// backend/routes/userRoutes.js
const express = require('express');
const { createUser, loginUser, updateUser, getUserById } = require('../controllers/userController');

const router = express.Router();

// Ruta para crear un nuevo usuario (primer formulario)
router.post('/users', createUser);

// Ruta para manejar el inicio de sesión
router.post('/users/login', loginUser);  // Corregido: loginUser debe estar importado

// Ruta para actualizar el perfil del usuario (segundo formulario)
router.put('/users/:id', updateUser);

// Ruta para obtener un usuario por ID
router.get('/users/:id', getUserById);

module.exports = router;
