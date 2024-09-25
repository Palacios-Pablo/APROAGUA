const express = require('express');
const { login, register } = require('../controllers/authController');  // Importa las funciones del controlador
const router = express.Router();

// Ruta para iniciar sesión (login)
router.post('/login', login);

// Ruta para registrar un nuevo usuario administrativo
router.post('/register', register);

module.exports = router;
