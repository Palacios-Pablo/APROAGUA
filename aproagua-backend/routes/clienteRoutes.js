const express = require('express');
const { getClientes, getClienteById, createCliente, updateCliente, deleteCliente } = require('../controllers/clienteController');
const authMiddleware = require('../middlewares/authMiddleware');  // Proteger las rutas con autenticación
const router = express.Router();

// Rutas de cliente protegidas
router.get('/', authMiddleware, getClientes);               // Obtener todos los clientes
router.get('/:id', authMiddleware, getClienteById);         // Obtener cliente por ID
router.post('/', authMiddleware, createCliente);            // Crear un nuevo cliente
router.put('/:id', authMiddleware, updateCliente);          // Actualizar un cliente
router.delete('/:id', authMiddleware, deleteCliente);       // Eliminar un cliente

module.exports = router;
