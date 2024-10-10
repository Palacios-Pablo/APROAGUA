// egresoRoutes.js
const express = require('express');
const router = express.Router();
const { getEgresos, createEgreso, updateEgreso, deleteEgreso } = require('../controllers/egresoController');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware de autenticación

// Rutas para gestionar los egresos
router.get('/', authMiddleware, getEgresos);         // Obtener todos los egresos
router.post('/', authMiddleware, createEgreso);      // Crear un nuevo egreso
router.put('/:id', authMiddleware, updateEgreso);    // Actualizar un egreso por ID
router.delete('/:id', authMiddleware, deleteEgreso); // Eliminar un egreso por ID

module.exports = router;
