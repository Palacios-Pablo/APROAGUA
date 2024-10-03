// src/routes/finanzasRoutes.js
const express = require('express');
const {
    obtenerBalances,
    obtenerEgresos,
    obtenerIngresosTotales,
    obtenerSaldoFinal
} = require('../controllers/finanzasController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas para obtener los balances
router.get('/balances', authMiddleware, obtenerBalances);

// Rutas para obtener los detalles de egresos
router.get('/egresos', authMiddleware, obtenerEgresos);

// Rutas para obtener los ingresos totales
router.get('/ingresos', authMiddleware, obtenerIngresosTotales);

// Ruta para obtener el saldo final
router.get('/saldo', authMiddleware, obtenerSaldoFinal);

module.exports = router;
