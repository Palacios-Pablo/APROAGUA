const express = require('express');
const { getPagos, createPago } = require('../controllers/pagoController');
const authMiddleware = require('../middlewares/authMiddleware');  // Proteger las rutas con autenticación
const router = express.Router();

// Rutas de pago protegidas
router.get('/', authMiddleware, getPagos);               // Obtener todos los pagos
router.post('/', authMiddleware, createPago);            // Registrar un nuevo pago

module.exports = router;
