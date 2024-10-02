const express = require('express');
const { getClientes, getClienteById, createCliente, updateCliente, deleteCliente, asignarTarifa, historialTarifas} = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');  // Proteger las rutas con autenticación
const router = express.Router();

// Rutas de cliente protegidas
router.get('/', authMiddleware, getClientes);               // Obtener todos los clientes
router.get('/:id', authMiddleware, getClienteById);         // Obtener cliente por ID
router.post('/', authMiddleware, createCliente);            // Crear un nuevo cliente
router.put('/:id', authMiddleware, updateCliente);          // Actualizar un cliente
router.delete('/:id', authMiddleware, deleteCliente);       // Eliminar un cliente
// Rutas para asignar tarifas y obtener historial
router.post('/asignar-tarifa', authMiddleware, asignarTarifa);  // Asignar una tarifa a un cliente
router.get('/:id_cliente/historial-tarifas', authMiddleware, historialTarifas);  // Obtener historial de tarifas de un cliente
module.exports = router;
