// src/routes/consumoRoutes.js
const express = require('express');
const { registrarConsumo, obtenerConsumosPorCliente, editarConsumo, eliminarConsumo } = require('../controllers/consumoController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Registrar un nuevo consumo
router.post('/', authMiddleware, registrarConsumo);

// Obtener el historial de consumo de un cliente
router.get('/:id_cliente', authMiddleware, obtenerConsumosPorCliente);

// Editar un consumo
router.put('/:id_consumo', authMiddleware, editarConsumo);

// Eliminar un consumo
router.delete('/:id_consumo', authMiddleware, eliminarConsumo);

module.exports = router;
