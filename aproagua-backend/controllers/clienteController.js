const pool = require('../config/dbconfig');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT cliente.ID_Cliente, cliente.Nombre, cliente.Apellido, cliente.Numero_Telefono, 
                   cliente.Direccion, cliente.ID_Zona, zona.Nombre AS Nombre_Zona
            FROM cliente
            LEFT JOIN zona ON cliente.ID_Zona = zona.ID_Zona
        `);
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
        const [rows] = await pool.execute('SELECT * FROM cliente WHERE ID_Cliente = ?', [id]);
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
        await pool.execute('INSERT INTO cliente (Nombre, Apellido, Numero_Telefono, Direccion, ID_Zona) VALUES (?, ?, ?, ?, ?)', 
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
            'UPDATE cliente SET Nombre = ?, Apellido = ?, Numero_Telefono = ?, Direccion = ?, ID_Zona = ? WHERE ID_Cliente = ?', 
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
// Cambia `id_cliente` por `id` para que coincida con la ruta
exports.eliminarCliente = async (req, res) => {
    const { id } = req.params;

    console.log('ID recibido en el backend:', id);  // Depuración

    if (!id) {
        return res.status(400).json({ msg: 'ID del cliente no proporcionado' });
    }

    try {
        // Primero eliminar las referencias en la tabla cliente_tarifa
        await pool.execute('DELETE FROM cliente_tarifa WHERE ID_Cliente = ?', [id]);

        // Luego eliminar al cliente de la tabla cliente
        await pool.execute('DELETE FROM cliente WHERE ID_Cliente = ?', [id]);

        res.status(200).json({ msg: 'Cliente eliminado correctamente' });
    } catch (err) {
        console.error('Error al eliminar cliente:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};



// Asignar tarifa a un cliente
exports.asignarTarifa = async (req, res) => {
    const { id_cliente, id_tarifa, fecha_inicio, fecha_fin } = req.body;

    try {
        // Asignar la tarifa al cliente en la tabla cliente_tarifa
        await pool.execute(
            'INSERT INTO cliente_tarifa (ID_Cliente, ID_Tarifa, Fecha_Inicio, Fecha_Fin) VALUES (?, ?, ?, ?)', 
            [id_cliente, id_tarifa, fecha_inicio, fecha_fin || null]  // Si no hay fecha_fin, asignamos null
        );
        res.status(201).json({ msg: 'Tarifa asignada exitosamente' });
    } catch (err) {
        console.error('Error al asignar tarifa:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};


// Obtener el historial de tarifas de un cliente con descripción y precio
exports.historialTarifas = async (req, res) => {
    const { id_cliente } = req.params;

    try {
        // Obtener la descripción y el precio de la tarifa junto con el historial
        const [rows] = await pool.execute(`
            SELECT ct.ID_Tarifa, t.Descripcion, t.Precio_Por_Litro, ct.Fecha_Inicio, ct.Fecha_Fin
            FROM cliente_tarifa ct
            JOIN tarifa t ON ct.ID_Tarifa = t.ID_Tarifa
            WHERE ct.ID_Cliente = ?
        `, [id_cliente]);

        if (rows.length === 0) {
            return res.status(404).json({ msg: 'No se encontró historial de tarifas para este cliente' });
        }

        res.json(rows);
    } catch (err) {
        console.error('Error al obtener historial de tarifas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
