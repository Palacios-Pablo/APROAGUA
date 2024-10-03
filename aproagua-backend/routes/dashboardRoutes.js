// src/routes/dashboardRoutes.js
const express = require('express');
const {
    obtenerResumenClientes,
    obtenerKPIs,
    generarCortePDF
} = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para obtener el resumen de clientes
router.get('/resumen-clientes', authMiddleware, obtenerResumenClientes);

// Ruta para obtener los KPIs
router.get('/kpis', authMiddleware, obtenerKPIs);

// Ruta para generar el PDF del corte de cuenta
router.get('/generar-pdf/:clienteId', authMiddleware, generarCortePDF);

module.exports = router;
