const express = require('express');
const { getFacturas, createFactura } = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/authMiddleware');  // Proteger las rutas con autenticación
const router = express.Router();

// Rutas de facturación protegidas
router.get('/', authMiddleware, getFacturas);               // Obtener todas las facturas
router.post('/', authMiddleware, createFactura);            // Generar una nueva factura

module.exports = router;
