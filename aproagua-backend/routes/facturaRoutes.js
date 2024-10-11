const express = require('express');
const router = express.Router();
const { 
    obtenerFacturasPendientes, 
    obtenerFacturasPagadas, 
    generarFacturasMensuales, 
    descargarFacturaPDF, 
    generarFacturaParaCliente // Añadimos la nueva función para generar factura por cliente
} = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para las facturas
router.get('/pendientes', authMiddleware, obtenerFacturasPendientes);  // Facturas pendientes
router.get('/pagadas', authMiddleware, obtenerFacturasPagadas);        // Facturas pagadas
router.post('/generar', authMiddleware, generarFacturasMensuales);     // Generar facturas mensuales
router.get('/:id_factura/pdf', authMiddleware, descargarFacturaPDF);   // Descargar factura en PDF

// Nueva ruta para generar factura de un cliente específico
router.post('/cliente/:id_cliente/generar', authMiddleware, async (req, res) => {
    const { id_cliente } = req.params;
    try {
        await generarFacturaParaCliente(id_cliente);
        res.status(201).json({ msg: 'Factura generada para el cliente correctamente' });
    } catch (err) {
        res.status(500).json({ msg: 'Error al generar factura para el cliente' });
    }
});

module.exports = router;
