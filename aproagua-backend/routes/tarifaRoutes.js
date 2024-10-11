const express = require('express');
const router = express.Router();
const { crearTarifa, obtenerTarifas, obtenerTarifaPorId, actualizarTarifa, eliminarTarifa } = require('../controllers/tarifaController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rutas CRUD de Tarifas
router.post('/', authMiddleware, crearTarifa);  // Crear una tarifa
router.get('/', authMiddleware, obtenerTarifas);  // Obtener todas las tarifas
router.get('/:id_tarifa', authMiddleware, obtenerTarifaPorId);  // Obtener una tarifa por ID
router.put('/:id_tarifa', authMiddleware, actualizarTarifa);  // Actualizar una tarifa
router.delete('/:id_tarifa', authMiddleware, eliminarTarifa);  // Eliminar una tarifa

module.exports = router;
