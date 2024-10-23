// src/controllers/dashboardController.js
const pool = require('../config/dbconfig');

// Obtener resumen de clientes para la tabla principal del dashboard
exports.obtenerResumenClientes = async (req, res) => {
    try {
        const [result] = await pool.execute(`
            SELECT
                cliente.Nombre,
                cliente.Apellido,
                cliente.Numero_Telefono,
                zona.Nombre as zona,
                (SELECT Litraje_Consumido FROM consumo WHERE ID_Cliente = cliente.ID_Cliente ORDER BY Fecha_Fin DESC LIMIT 1) AS Ultimo_Consumo,
                (SELECT MAX(Fecha_Emision) FROM factura WHERE ID_Cliente = cliente.ID_Cliente AND Estado = 'pagado') AS Ultimo_Mes_Pagado,
                (SELECT COUNT(*) FROM factura WHERE ID_Cliente = cliente.ID_Cliente AND Estado = 'pendiente') AS Meses_Pendientes
            FROM cliente
            LEFT JOIN zona ON cliente.ID_Zona = zona.ID_Zona
        `);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al obtener resumen de clientes:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener los KPIs del dashboard
exports.obtenerKPIs = async (req, res) => {
    try {
        // Número total de clientes
        const [clientesTotales] = await pool.execute(`SELECT COUNT(*) AS totalClientes FROM cliente`);

        // Clientes con pagos pendientes
        const [clientesConPagosPendientes] = await pool.execute(`
            SELECT COUNT(DISTINCT ID_Cliente) AS clientesPendientes FROM factura WHERE Estado = 'pendiente'
        `);

        // Ingresos del mes actual
        const [ingresosDelMes] = await pool.execute(`
            SELECT SUM(Monto_Pagado) AS ingresosMes FROM pago WHERE MONTH(Fecha_Pago) = MONTH(CURDATE()) AND YEAR(Fecha_Pago) = YEAR(CURDATE())
        `);

        // Total de litros consumidos en el mes actual
        const [litrosConsumidosMes] = await pool.execute(`
            SELECT SUM(Litraje_Consumido) AS litrosConsumidos FROM consumo WHERE MONTH(Fecha_Fin) = MONTH(CURDATE()) AND YEAR(Fecha_Fin) = YEAR(CURDATE())
        `);

        res.status(200).json({
            totalClientes: clientesTotales[0].totalClientes,
            clientesPendientes: clientesConPagosPendientes[0].clientesPendientes,
            ingresosMes: ingresosDelMes[0].ingresosMes,
            litrosConsumidos: litrosConsumidosMes[0].litrosConsumidos
        });
    } catch (err) {
        console.error('Error al obtener KPIs:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar PDF del corte de cuenta
exports.generarCortePDF = async (req, res) => {
    const { clienteId } = req.params;

    try {
        // Aquí deberíamos generar el PDF del corte de cuenta para el cliente
        // Puedes usar una librería como `pdfkit` o `puppeteer` para crear y enviar el PDF
        // Ejemplo simplificado
        res.status(200).json({ msg: `Generando PDF del cliente ID ${clienteId}` });
    } catch (err) {
        console.error('Error al generar PDF:', err);
        res.status(500).json({ msg: 'Error al generar el PDF' });
    }
};
