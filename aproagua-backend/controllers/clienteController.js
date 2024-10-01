const pool = require('../config/dbconfig');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM Cliente');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener clientes:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.execute('SELECT * FROM Cliente WHERE ID_Cliente = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener cliente:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
    const { nombre, apellido, numero_telefono, direccion, id_zona } = req.body;

    try {
        await pool.execute('INSERT INTO Cliente (Nombre, Apellido, Numero_Telefono, Direccion, ID_Zona) VALUES (?, ?, ?, ?, ?)', 
            [nombre, apellido, numero_telefono, direccion, id_zona]);
        res.status(201).json({ msg: 'Cliente creado exitosamente' });
    } catch (err) {
        console.error('Error al crear cliente:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Actualizar un cliente
exports.updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, numero_telefono, direccion, id_zona } = req.body;

    // Verificar que los parámetros existan
    if (!nombre || !apellido || !numero_telefono || !direccion || !id_zona) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE Cliente SET Nombre = ?, Apellido = ?, Numero_Telefono = ?, Direccion = ?, ID_Zona = ? WHERE ID_Cliente = ?', 
            [nombre, apellido, numero_telefono, direccion, id_zona, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json({ msg: 'Cliente actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar cliente:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM Cliente WHERE ID_Cliente = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        res.json({ msg: 'Cliente eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
