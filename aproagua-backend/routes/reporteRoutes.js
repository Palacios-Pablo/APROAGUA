const express = require('express');
const { generarReporteClientesPDF, generarReporteClientesExcel } = require('../controllers/reporteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Ruta para generar el PDF de clientes
router.get('/clientes/pdf', authMiddleware, generarReporteClientesPDF);

// Ruta para generar el Excel de clientes
router.get('/clientes/excel', authMiddleware, generarReporteClientesExcel);

module.exports = router;
