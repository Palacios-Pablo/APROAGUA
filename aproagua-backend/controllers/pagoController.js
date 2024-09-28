const pool = require('../config/dbconfig');

// Obtener todos los pagos
exports.getPagos = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Pago');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener pagos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Registrar un nuevo pago
exports.createPago = async (req, res) => {
    const { id_factura, fecha_pago, monto_pagado, id_balance } = req.body;

    try {
        await pool.execute('INSERT INTO Pago (ID_Factura, Fecha_Pago, Monto_Pagado, ID_Balance) VALUES (?, ?, ?, ?)', 
            [id_factura, fecha_pago, monto_pagado, id_balance]);
        res.status(201).json({ msg: 'Pago registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar pago:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
