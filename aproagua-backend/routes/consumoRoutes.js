const express = require('express');
const { getConsumos, createConsumo } = require('../controllers/consumoController');
const authMiddleware = require('../middlewares/authMiddleware');  // Proteger las rutas con autenticación
const router = express.Router();

// Rutas de consumo protegidas
router.get('/', authMiddleware, getConsumos);               // Obtener todos los consumos
router.post('/', authMiddleware, createConsumo);            // Registrar un nuevo consumo

module.exports = router;
