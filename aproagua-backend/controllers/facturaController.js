const pool = require('../config/dbConfig');

// Obtener todas las facturas
exports.getFacturas = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Factura');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener facturas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar una nueva factura
exports.createFactura = async (req, res) => {
    const { id_cliente, id_consumo, fecha_emision, monto, estado } = req.body;

    try {
        await pool.execute('INSERT INTO Factura (ID_Cliente, ID_Consumo, Fecha_Emision, Monto, Estado) VALUES (?, ?, ?, ?, ?)', 
            [id_cliente, id_consumo, fecha_emision, monto, estado]);
        res.status(201).json({ msg: 'Factura generada exitosamente' });
    } catch (err) {
        console.error('Error al generar factura:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
