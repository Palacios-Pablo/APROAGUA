// src/routes/pagoRoutes.js
const express = require('express');
const { registrarPago, obtenerPagos, revertirPago } = require('../controllers/pagoController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Registrar un nuevo pago
router.post('/', authMiddleware, registrarPago);

// Obtener el historial de pagos
router.get('/', authMiddleware, obtenerPagos);

// Revertir un pago
router.delete('/:id_pago', authMiddleware, revertirPago);

module.exports = router;
