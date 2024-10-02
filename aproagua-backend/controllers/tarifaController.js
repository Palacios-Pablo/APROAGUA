const pool = require('../config/dbconfig');

// Crear una tarifa
exports.crearTarifa = async (req, res) => {
    const { descripcion, precio_por_litro } = req.body;

    try {
        await pool.execute(
            'INSERT INTO Tarifa (Descripcion, Precio_Por_Litro) VALUES (?, ?)', 
            [descripcion, precio_por_litro]
        );
        res.status(201).json({ msg: 'Tarifa creada exitosamente' });
    } catch (err) {
        console.error('Error al crear tarifa:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener todas las tarifas
exports.obtenerTarifas = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Tarifa');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener tarifas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener una tarifa por ID
exports.obtenerTarifaPorId = async (req, res) => {
    const { id_tarifa } = req.params;

    try {
        const [rows] = await pool.execute('SELECT * FROM Tarifa WHERE ID_Tarifa = ?', [id_tarifa]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Tarifa no encontrada' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener tarifa:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Actualizar una tarifa
exports.actualizarTarifa = async (req, res) => {
    const { id_tarifa } = req.params;
    const { descripcion, precio_por_litro } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE Tarifa SET Descripcion = ?, Precio_Por_Litro = ? WHERE ID_Tarifa = ?', 
            [descripcion, precio_por_litro, id_tarifa]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Tarifa no encontrada' });
        }

        res.json({ msg: 'Tarifa actualizada exitosamente' });
    } catch (err) {
        console.error('Error al actualizar tarifa:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Eliminar una tarifa
exports.eliminarTarifa = async (req, res) => {
    const { id_tarifa } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM Tarifa WHERE ID_Tarifa = ?', [id_tarifa]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Tarifa no encontrada' });
        }

        res.json({ msg: 'Tarifa eliminada exitosamente' });
    } catch (err) {
        console.error('Error al eliminar tarifa:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
