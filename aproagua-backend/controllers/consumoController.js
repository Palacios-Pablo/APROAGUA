const pool = require('../config/dbconfig');

// Obtener todos los registros de consumo
exports.getConsumos = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Consumo');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener consumos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Registrar un nuevo consumo
exports.createConsumo = async (req, res) => {
    const { id_cliente, fecha_inicio, fecha_fin, litraje_consumido } = req.body;

    try {
        await pool.execute('INSERT INTO Consumo (ID_Cliente, Fecha_Inicio, Fecha_Fin, Litraje_Consumido) VALUES (?, ?, ?, ?)', 
            [id_cliente, fecha_inicio, fecha_fin, litraje_consumido]);
        res.status(201).json({ msg: 'Consumo registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar consumo:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
