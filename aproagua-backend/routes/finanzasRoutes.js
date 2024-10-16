// Definir las rutas en tu archivo de rutas, ejemplo: src/routes/finanzasRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerPagos } = require('../controllers/pagoController');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware de autenticación


const { obtenerBalanceGeneral, obtenerEgresos, obtenerSaldoFinal, obtenerIngresosTotales } = require('../controllers/finanzasController');

// Ruta para obtener el balance general (sin fechas)
router.get('/balance-general', authMiddleware, obtenerBalanceGeneral);

// Ruta para obtener los egresos
router.get('/egresos', authMiddleware, obtenerEgresos);

// Ruta para obtener los ingresos totales (no necesitas esta ruta si ya estás obteniendo los ingresos del balance general)
router.get('/ingresos', authMiddleware, obtenerIngresosTotales);

// Ruta para obtener el saldo final (no es necesaria si ya tienes los ingresos y egresos del balance general)
router.get('/saldo', authMiddleware, obtenerSaldoFinal);

// Ruta para obtener los pagos (Detalle de Ingresos)
router.get('/ingresos-detalles', authMiddleware, obtenerPagos);  

module.exports = router;
