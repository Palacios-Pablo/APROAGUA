const pool = require('../config/dbconfig');
const PDFDocument = require('pdfkit');  // Para generar PDFs en Node.js


// Función para obtener estado de pagos mensuales por cliente y año
exports.obtenerEstadoPagosMensuales = async (id_cliente, anio) => {
    // Generar un arreglo base de 12 meses
    const meses = Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1,
        estado: 'pendiente',
    }));

    try {
        // Consultar consumos del cliente en el año especificado
        const [consumos] = await pool.execute(`
            SELECT c.Fecha_Inicio, c.Fecha_Fin, f.Estado
            FROM consumo c
            LEFT JOIN factura f ON c.ID_Consumo = f.ID_Consumo
            WHERE c.ID_Cliente = ? AND YEAR(c.Fecha_Inicio) = ?
        `, [id_cliente, anio]);

        consumos.forEach(consumo => {
            const inicio = new Date(consumo.Fecha_Inicio);
            const fin = new Date(consumo.Fecha_Fin);

            for (let d = new Date(inicio); d <= fin; d.setMonth(d.getMonth() + 1)) {
                const mesIndex = d.getMonth(); // Meses en base 0
                meses[mesIndex].estado = consumo.Estado === 'pagado' ? 'pagado' : 'pendiente';
            }
        });

        return meses;
    } catch (err) {
        console.error('Error al calcular estado de pagos por consumo:', err);
        throw new Error('Error al calcular estado de pagos por consumo');
    }
};

// Generar factura para un cliente en base a los meses enviados
exports.generarFacturaParaCliente = async (id_cliente, fecha_inicio, fecha_fin) => {
    try {
        // Verificar consumos no facturados dentro del rango de fechas
        const [consumos] = await pool.execute(`
            SELECT * FROM consumo
            WHERE ID_Cliente = ? AND Fecha_Inicio >= ? AND Fecha_Fin <= ? AND Facturado = FALSE
        `, [id_cliente, fecha_inicio, fecha_fin]);

        if (consumos.length > 0) {
            // Obtener la tarifa actual del cliente
            const [tarifaCliente] = await pool.execute(`
                SELECT t.Precio_Por_Litro 
                FROM cliente_tarifa ct
                JOIN tarifa t ON ct.ID_Tarifa = t.ID_Tarifa
                WHERE ct.ID_Cliente = ? AND (ct.Fecha_Fin IS NULL OR ct.Fecha_Fin >= CURDATE())
                ORDER BY ct.Fecha_Inicio DESC LIMIT 1
            `, [id_cliente]);

            if (tarifaCliente.length > 0) {
                const tarifa = tarifaCliente[0].Precio_Por_Litro;

                // Calcular la cantidad de meses entre las fechas de inicio y fin
                const calcularMeses = (fechaInicio, fechaFin) => {
                    const fechaInicioDate = new Date(fechaInicio);
                    const fechaFinDate = new Date(fechaFin);

                    // Calcular diferencia en años y meses
                    const añosDiferencia = fechaFinDate.getFullYear() - fechaInicioDate.getFullYear();
                    const mesesDiferencia = fechaFinDate.getMonth() - fechaInicioDate.getMonth();

                    return (añosDiferencia * 12) + mesesDiferencia + 1; // +1 para incluir el mes de inicio
                };

                const meses = calcularMeses(fecha_inicio, fecha_fin);

                // Validar que el cálculo de meses sea correcto
                if (meses < 1) {
                    console.log('El rango de fechas seleccionado no es válido.');
                    return;
                }

                // Generar factura por cada consumo
                for (const consumo of consumos) {
                    const monto = meses * tarifa;

                    // Registrar la factura asociada al consumo
                    await pool.execute(`
                        INSERT INTO factura (ID_Cliente, ID_Consumo, Fecha_Emision, Monto, Estado)
                        VALUES (?, ?, CURDATE(), ?, 'pendiente')
                    `, [id_cliente, consumo.ID_Consumo, monto]);

                    // Marcar el consumo como facturado
                    await pool.execute(`
                        UPDATE consumo SET Facturado = TRUE WHERE ID_Consumo = ?
                    `, [consumo.ID_Consumo]);
                }

                console.log(`Facturas generadas para el cliente ${id_cliente}.`);
            } else {
                console.log('No se encontró una tarifa válida para el cliente.');
            }
        } else {
            console.log('No se encontraron consumos no facturados en el rango de fechas.');
        }
    } catch (err) {
        console.error('Error al generar factura:', err);
        throw new Error('Error al generar factura');
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
