const pool = require('../config/dbconfig');

// Registrar un nuevo pago
exports.registrarPago = async (req, res) => {
    const { id_factura, fecha_pago, monto_pagado } = req.body;

    if (!id_factura || !fecha_pago || !monto_pagado) {
        return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
    }

    try {
        // Verificar que la factura esté pendiente
        const [factura] = await pool.execute('SELECT Monto, Estado FROM factura WHERE ID_Factura = ?', [id_factura]);

        if (factura.length === 0) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        if (factura[0].Estado !== 'pendiente') {
            return res.status(400).json({ msg: 'La factura ya está pagada' });
        }

        // Insertar el pago en la tabla Pago
        await pool.execute(
            'INSERT INTO pago (ID_Factura, ID_Balance, Fecha_Pago, Monto_Pagado) VALUES (?, ?, ?, ?)',
            [id_factura, 1, fecha_pago, monto_pagado]  // ID_Balance es fijo, siempre apunta al balance general (ID=1)
        );

        // Actualizar el balance general (ID_Balance = 1)
        const [balance] = await pool.execute('SELECT * FROM balance WHERE ID_Balance = 1');
        let nuevoSaldo = balance.length > 0 ? balance[0].Saldo + monto_pagado : monto_pagado;

        await pool.execute(
            'UPDATE balance SET Total_Ingresos = Total_Ingresos + ?, Saldo = ? WHERE ID_Balance = 1',
            [monto_pagado, nuevoSaldo]
        );

        // Verificar si el monto pagado cubre el total de la factura y marcarla como pagada
        const [pagosAcumulados] = await pool.execute(
            'SELECT SUM(Monto_Pagado) AS TotalPagado FROM pago WHERE ID_Factura = ?',
            [id_factura]
        );

        if (pagosAcumulados[0].TotalPagado >= factura[0].Monto) {
            await pool.execute('UPDATE factura SET Estado = ? WHERE ID_Factura = ?', ['pagado', id_factura]);
        }

        res.status(201).json({ msg: 'Pago registrado correctamente' });
    } catch (err) {
        console.error('Error al registrar pago:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener el historial de pagos
exports.obtenerPagos = async (req, res) => {
    try {
        const [pagos] = await pool.execute(`
            SELECT p.ID_Pago, p.Fecha_Pago, p.Monto_Pagado, f.ID_Factura, c.Nombre, c.Apellido, b.Saldo
            FROM pago p
            JOIN factura f ON p.ID_Factura = f.ID_Factura
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            LEFT JOIN balance b ON p.ID_Balance = b.ID_Balance
        `);
        res.status(200).json(pagos);
    } catch (err) {
        console.error('Error al obtener pagos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Revertir o anular un pago
exports.revertirPago = async (req, res) => {
    const { id_pago } = req.params;

    try {
        // Obtener el pago a revertir
        const [pago] = await pool.execute('SELECT * FROM pago WHERE ID_Pago = ?', [id_pago]);

        if (pago.length === 0) {
            return res.status(404).json({ msg: 'Pago no encontrado' });
        }

        const montoPagado = pago[0].Monto_Pagado;
        const idFactura = pago[0].ID_Factura;
        const idBalance = pago[0].ID_Balance;

        // Eliminar el pago
        await pool.execute('DELETE FROM pago WHERE ID_Pago = ?', [id_pago]);

        // Actualizar el balance general (ID_Balance = 1)
        await pool.execute(
            'UPDATE balance SET Total_Ingresos = Total_Ingresos - ?, Saldo = Saldo - ? WHERE ID_Balance = 1', 
            [montoPagado, montoPagado]
        );

        // Verificar si la factura debe volver a estado pendiente
        const [factura] = await pool.execute(`
            SELECT f.ID_Factura, f.Monto, SUM(p.Monto_Pagado) AS TotalPagado
            FROM factura f
            LEFT JOIN pago p ON f.ID_Factura = p.ID_Factura
            WHERE f.ID_Factura = ?
            GROUP BY f.ID_Factura
        `, [idFactura]);

        if (factura.length > 0 && factura[0].TotalPagado < factura[0].Monto) {
            await pool.execute('UPDATE factura SET Estado = ? WHERE ID_Factura = ?', ['pendiente', idFactura]);
        }

        res.status(200).json({ msg: 'Pago revertido correctamente' });
    } catch (err) {
        console.error('Error al revertir pago:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
