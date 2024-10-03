// src/routes/facturaRoutes.js
const express = require('express');
const { generarFacturasMensuales, obtenerFacturas, marcarFacturaComoPagada, descargarFacturaPDF } = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Generar facturas mensuales
router.post('/generar', authMiddleware, generarFacturasMensuales);

// Obtener el historial de facturas
router.get('/', authMiddleware, obtenerFacturas);

// Marcar una factura como pagada
router.put('/:id_factura/pagada', authMiddleware, marcarFacturaComoPagada);

// Descargar una factura en PDF
router.get('/:id_factura/pdf', authMiddleware, descargarFacturaPDF);

module.exports = router;
