// src/routes/reporteRoutes.js
const express = require('express');
const {
    generarReporteEgresos,
    generarReporteIngresos,
    generarReporteConsumo,
    generarReporteFacturacion,
    generarReporteExcel,
    generarReportePDF
} = require('../controllers/reporteController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


// Reporte de egresos
router.get('/egresos', authMiddleware, generarReporteEgresos);

// Reporte de ingresos
router.get('/ingresos', authMiddleware, generarReporteIngresos);

// Reporte de consumo
router.get('/consumo', authMiddleware, generarReporteConsumo);

// Reporte de facturación
router.get('/facturacion', authMiddleware, generarReporteFacturacion);

// Descargar en Excel
router.get('/descargar/excel', authMiddleware, generarReporteExcel);

// Descargar en PDF
router.get('/descargar/pdf', authMiddleware, generarReportePDF);

module.exports = router;
