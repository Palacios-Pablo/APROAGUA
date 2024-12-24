const pool = require('../config/dbconfig');

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

// Obtener todas las facturas pendientes
exports.obtenerFacturasPendientes = async (req, res) => {
    try {
        const [facturas] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.Estado = 'pendiente'
        `);
        res.status(200).json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas pendientes:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener todas las facturas pagadas
exports.obtenerFacturasPagadas = async (req, res) => {
    try {
        const [facturas] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.Estado = 'pagado'
        `);
        res.status(200).json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas pagadas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar facturas automáticamente solo con consumos no facturados
exports.generarFacturasMensuales = async (req, res) => {
    try {
        // Obtener todos los clientes
        const [clientes] = await pool.execute('SELECT * FROM cliente');

        for (const cliente of clientes) {
            // Obtener los consumos no facturados del cliente en el último mes
            const [consumos] = await pool.execute(`
                SELECT * FROM consumo
                WHERE ID_Cliente = ? AND Fecha_Inicio >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND Facturado = FALSE
            `, [cliente.ID_Cliente]);

            if (consumos.length > 0) {
                // Obtener la tarifa actual del cliente
                const [tarifaCliente] = await pool.execute(`
                    SELECT t.Precio_Por_Litro FROM cliente_tarifa ct
                    JOIN tarifa t ON ct.ID_Tarifa = t.ID_Tarifa
                    WHERE ct.ID_Cliente = ? AND (ct.Fecha_Fin IS NULL OR ct.Fecha_Fin >= CURDATE())
                    ORDER BY ct.Fecha_Inicio DESC LIMIT 1
                `, [cliente.ID_Cliente]);

                if (tarifaCliente.length > 0) {
                    const tarifa = tarifaCliente[0].Precio_Por_Litro;
                    let totalConsumo = 0;

                    // Calcular el monto total basado en el litraje y la tarifa
                    for (const consumo of consumos) {
                        totalConsumo += consumo.Litraje_Consumido * tarifa;
                    }

                    // Insertar la factura en la base de datos
                    await pool.execute(`
                        INSERT INTO factura (ID_Cliente, ID_Consumo, Fecha_Emision, Monto, Estado)
                        VALUES (?, ?, CURDATE(), ?, 'pendiente')
                    `, [cliente.ID_Cliente, consumos[0].ID_Consumo, totalConsumo]);

                    // Marcar estos consumos como facturados
                    await pool.execute(`
                        UPDATE consumo SET Facturado = TRUE WHERE ID_Cliente = ? AND Facturado = FALSE
                    `, [cliente.ID_Cliente]);
                }
            }
        }

        res.status(201).json({ msg: 'Facturas generadas correctamente' });
    } catch (err) {
        console.error('Error al generar facturas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Descargar factura en PDF
exports.descargarFacturaPDF = async (req, res) => {
    const { id_factura } = req.params;

    try {
        // Obtener los datos de la factura
        const [factura] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.ID_Factura = ?
        `, [id_factura]);

        if (factura.length === 0) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura_${id_factura}.pdf`);

        doc.text(`Factura ID: ${factura[0].ID_Factura}`);
        doc.text(`Cliente: ${factura[0].Nombre} ${factura[0].Apellido}`);
        doc.text(`Fecha de Emisión: ${factura[0].Fecha_Emision}`);
        doc.text(`Monto: Q. ${factura[0].Monto}`);
        doc.text(`Estado: ${factura[0].Estado}`);

        // Finalizar el documento PDF
        doc.pipe(res);
        doc.end();
    } catch (err) {
        console.error('Error al descargar factura PDF:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener todas las facturas pendientes
exports.obtenerFacturasPendientes = async (req, res) => {
    try {
        const [facturas] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.Estado = 'pendiente'
        `);
        res.status(200).json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas pendientes:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener todas las facturas pagadas
exports.obtenerFacturasPagadas = async (req, res) => {
    try {
        const [facturas] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.Estado = 'pagado'
        `);
        res.status(200).json(facturas);
    } catch (err) {
        console.error('Error al obtener facturas pagadas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar facturas automáticamente solo con consumos no facturados
exports.generarFacturasMensuales = async (req, res) => {
    try {
        // Obtener todos los clientes
        const [clientes] = await pool.execute('SELECT * FROM cliente');

        for (const cliente of clientes) {
            // Obtener los consumos no facturados del cliente en el último mes
            const [consumos] = await pool.execute(`
                SELECT * FROM consumo
                WHERE ID_Cliente = ? AND Fecha_Inicio >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND Facturado = FALSE
            `, [cliente.ID_Cliente]);

            if (consumos.length > 0) {
                // Obtener la tarifa actual del cliente
                const [tarifaCliente] = await pool.execute(`
                    SELECT t.Precio_Por_Litro FROM cliente_tarifa ct
                    JOIN tarifa t ON ct.ID_Tarifa = t.ID_Tarifa
                    WHERE ct.ID_Cliente = ? AND (ct.Fecha_Fin IS NULL OR ct.Fecha_Fin >= CURDATE())
                    ORDER BY ct.Fecha_Inicio DESC LIMIT 1
                `, [cliente.ID_Cliente]);

                if (tarifaCliente.length > 0) {
                    const tarifa = tarifaCliente[0].Precio_Por_Litro;
                    let totalConsumo = 0;

                    // Calcular el monto total basado en el litraje y la tarifa
                    for (const consumo of consumos) {
                        totalConsumo += consumo.Litraje_Consumido * tarifa;
                    }

                    // Insertar la factura en la base de datos
                    await pool.execute(`
                        INSERT INTO factura (ID_Cliente, ID_Consumo, Fecha_Emision, Monto, Estado)
                        VALUES (?, ?, CURDATE(), ?, 'pendiente')
                    `, [cliente.ID_Cliente, consumos[0].ID_Consumo, totalConsumo]);

                    // Marcar estos consumos como facturados
                    await pool.execute(`
                        UPDATE consumo SET Facturado = TRUE WHERE ID_Cliente = ? AND Facturado = FALSE
                    `, [cliente.ID_Cliente]);
                }
            }
        }

        res.status(201).json({ msg: 'Facturas generadas correctamente' });
    } catch (err) {
        console.error('Error al generar facturas:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Descargar factura en PDF
exports.descargarFacturaPDF = async (req, res) => {
    const { id_factura } = req.params;

    try {
        // Obtener los datos de la factura
        const [factura] = await pool.execute(`
            SELECT f.ID_Factura, c.Nombre, c.Apellido, f.Fecha_Emision, f.Monto, f.Estado
            FROM factura f
            JOIN cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.ID_Factura = ?
        `, [id_factura]);

        if (factura.length === 0) {
            return res.status(404).json({ msg: 'Factura no encontrada' });
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=factura_${id_factura}.pdf`);

        doc.text(`Factura ID: ${factura[0].ID_Factura}`);
        doc.text(`Cliente: ${factura[0].Nombre} ${factura[0].Apellido}`);
        doc.text(`Fecha de Emisión: ${factura[0].Fecha_Emision}`);
        doc.text(`Monto: Q. ${factura[0].Monto}`);
        doc.text(`Estado: ${factura[0].Estado}`);

        // Finalizar el documento PDF
        doc.pipe(res);
        doc.end();
    } catch (err) {
        console.error('Error al descargar factura PDF:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
