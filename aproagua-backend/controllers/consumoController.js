// src/controllers/consumoController.js
const pool = require('../config/dbconfig');
const { generarFacturaParaCliente } = require('./facturaController');

// Registrar un nuevo consumo basado en los meses enviados desde el frontend
exports.registrarConsumo = async (req, res) => {
    const { id_cliente, mes_inicio, año_inicio, mes_fin, año_fin, litraje_consumido } = req.body;

    if (!id_cliente || !mes_inicio || !año_inicio || !mes_fin || !año_fin || !litraje_consumido) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    // Calcular las fechas de inicio y fin usando los meses y años proporcionados
    const fechaInicio = new Date(año_inicio, mes_inicio - 1, 1); // Día 1 del mes de inicio
    const fechaFin = new Date(año_fin, mes_fin, 0); // Último día del mes de fin (mes_fin + 1, día 0 da el último día)

    try {
        // Registrar el consumo en la base de datos con las fechas calculadas
        await pool.execute(
            'INSERT INTO Consumo (ID_Cliente, Fecha_Inicio, Fecha_Fin, Litraje_Consumido) VALUES (?, ?, ?, ?)',
            [id_cliente, fechaInicio, fechaFin, litraje_consumido]
        );

        // Generar factura para el cliente basándote en el nuevo consumo registrado
        await generarFacturaParaCliente(id_cliente, fechaInicio, fechaFin); 
        res.status(201).json({ msg: 'Consumo registrado exitosamente y facturación generada.' });
    } catch (err) {
        console.error('Error al registrar consumo:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener el historial de consumos de un cliente
exports.obtenerConsumosPorCliente = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        const [consumos] = await pool.execute('SELECT * FROM Consumo WHERE ID_Cliente = ?', [id_cliente]);
        res.status(200).json(consumos);
    } catch (err) {
        console.error('Error al obtener consumos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Editar un registro de consumo
exports.editarConsumo = async (req, res) => {
    const { id_consumo } = req.params;
    const { fecha_inicio, fecha_fin, litraje_consumido } = req.body;

    if (!fecha_inicio || !fecha_fin || !litraje_consumido) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        await pool.execute(
            'UPDATE Consumo SET Fecha_Inicio = ?, Fecha_Fin = ?, Litraje_Consumido = ? WHERE ID_Consumo = ?',
            [fecha_inicio, fecha_fin, litraje_consumido, id_consumo]
        );
        res.status(200).json({ msg: 'Consumo actualizado correctamente' });
    } catch (err) {
        console.error('Error al editar consumo:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Eliminar un registro de consumo
exports.eliminarConsumo = async (req, res) => {
    const { id_consumo } = req.params;

    try {
        await pool.execute('DELETE FROM Consumo WHERE ID_Consumo = ?', [id_consumo]);
        res.status(200).json({ msg: 'Consumo eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar consumo:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
