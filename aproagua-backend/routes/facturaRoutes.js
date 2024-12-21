const express = require('express');
const router = express.Router();
const { 
    obtenerFacturasPendientes, 
    obtenerFacturasPagadas, 
    generarFacturasMensuales, 
    descargarFacturaPDF, 
    generarFacturaParaCliente,
    obtenerEstadoPagosMensuales // Agregar el controlador correspondiente
} = require('../controllers/facturaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas para las facturas
router.get('/pendientes', authMiddleware, obtenerFacturasPendientes);  // Facturas pendientes
router.get('/pagadas', authMiddleware, obtenerFacturasPagadas);        // Facturas pagadas
router.post('/generar', authMiddleware, generarFacturasMensuales);     // Generar facturas mensuales
router.get('/:id_factura/pdf', authMiddleware, descargarFacturaPDF);   // Descargar factura en PDF

// Nueva ruta para obtener estado de pagos mensuales
router.get('/pagos/:id_cliente/:anio', authMiddleware, async (req, res) => {
    const { id_cliente, anio } = req.params;
    try {
        const estadoPagos = await obtenerEstadoPagosMensuales(id_cliente, anio);
        res.status(200).json(estadoPagos);
    } catch (err) {
        console.error('Error al obtener el estado de pagos:', err);
        res.status(500).json({ msg: 'Error al obtener el estado de pagos' });
    }
});

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
