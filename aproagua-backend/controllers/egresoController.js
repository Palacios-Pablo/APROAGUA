const pool = require('../config/dbconfig');  // Conexión a la base de datos

// Obtener todos los egresos
exports.getEgresos = async (req, res) => {
    try {
        const [egresos] = await pool.query('SELECT * FROM egreso');
        res.json(egresos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Registrar un nuevo egreso
exports.createEgreso = async (req, res) => {
    const { fecha, descripcion, monto, id_balance } = req.body;

    if (!fecha || !descripcion || !monto) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        await pool.query('INSERT INTO egreso (Fecha, Descripcion, Monto, ID_Balance) VALUES (?, ?, ?, ?)', [fecha, descripcion, monto, id_balance]);
        res.json({ msg: 'Egreso registrado con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Editar un egreso existente
exports.updateEgreso = async (req, res) => {
    const { id } = req.params;  // Obtenemos el id del egreso a editar
    const { fecha, descripcion, monto, id_balance } = req.body;  // Datos actualizados del egreso

    // Validamos que los campos estén completos
    if (!fecha || !descripcion || !monto) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        // Ejecutamos la consulta SQL para actualizar el egreso
        const [result] = await pool.query(
            'UPDATE egreso SET Fecha = ?, Descripcion = ?, Monto = ?, ID_Balance = ? WHERE ID_Egreso = ?', 
            [fecha, descripcion, monto, id_balance, id]
        );

        // Verificamos si el egreso fue encontrado y actualizado
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Egreso no encontrado' });
        }

        res.json({ msg: 'Egreso actualizado con éxito' });  // Confirmación de éxito
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Eliminar un egreso
exports.deleteEgreso = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM egreso WHERE ID_Egreso = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Egreso no encontrado' });
        }
        res.json({ msg: 'Egreso eliminado con éxito' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

