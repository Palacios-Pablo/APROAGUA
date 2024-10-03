// src/controllers/reporteController.js
const pool = require('../config/dbconfig');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Generar Reporte de Ingresos
exports.generarReporteIngresos = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT p.Fecha_Pago, p.Monto_Pagado, c.Nombre, c.Apellido
            FROM Pago p
            JOIN Factura f ON p.ID_Factura = f.ID_Factura
            JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE p.Fecha_Pago BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Error al generar reporte de ingresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar Reporte de Consumo
exports.generarReporteConsumo = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio, con.Fecha_Fin, con.Litraje_Consumido
            FROM Consumo con
            JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
            WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Error al generar reporte de consumo:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Generar Reporte de Facturación
exports.generarReporteFacturacion = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT f.ID_Factura, f.Fecha_Emision, f.Monto, f.Estado, c.Nombre, c.Apellido
            FROM Factura f
            JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
            WHERE f.Fecha_Emision BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Error al generar reporte de facturación:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Descargar Reporte en Excel
exports.generarReporteExcel = async (req, res) => {
    const { tipo, fechaInicio, fechaFin } = req.query;

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Reporte');

        // Definir columnas según el tipo de reporte
        if (tipo === 'ingresos') {
            sheet.columns = [
                { header: 'Fecha de Pago', key: 'Fecha_Pago', width: 20 },
                { header: 'Monto Pagado', key: 'Monto_Pagado', width: 15 },
                { header: 'Nombre Cliente', key: 'Nombre', width: 20 },
                { header: 'Apellido Cliente', key: 'Apellido', width: 20 }
            ];
            const [ingresos] = await pool.execute(
                `SELECT p.Fecha_Pago, p.Monto_Pagado, c.Nombre, c.Apellido
                FROM Pago p
                JOIN Factura f ON p.ID_Factura = f.ID_Factura
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE p.Fecha_Pago BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            sheet.addRows(ingresos);
        } else if (tipo === 'consumo') {
            sheet.columns = [
                { header: 'Nombre Cliente', key: 'Nombre', width: 20 },
                { header: 'Apellido Cliente', key: 'Apellido', width: 20 },
                { header: 'Fecha Inicio', key: 'Fecha_Inicio', width: 20 },
                { header: 'Fecha Fin', key: 'Fecha_Fin', width: 20 },
                { header: 'Litraje Consumido', key: 'Litraje_Consumido', width: 20 }
            ];
            const [consumos] = await pool.execute(
                `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio, con.Fecha_Fin, con.Litraje_Consumido
                FROM Consumo con
                JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
                WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            sheet.addRows(consumos);
        } else if (tipo === 'facturacion') {
            sheet.columns = [
                { header: 'ID Factura', key: 'ID_Factura', width: 10 },
                { header: 'Fecha Emisión', key: 'Fecha_Emision', width: 20 },
                { header: 'Monto', key: 'Monto', width: 15 },
                { header: 'Estado', key: 'Estado', width: 15 },
                { header: 'Nombre Cliente', key: 'Nombre', width: 20 },
                { header: 'Apellido Cliente', key: 'Apellido', width: 20 }
            ];
            const [facturacion] = await pool.execute(
                `SELECT f.ID_Factura, f.Fecha_Emision, f.Monto, f.Estado, c.Nombre, c.Apellido
                FROM Factura f
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE f.Fecha_Emision BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            sheet.addRows(facturacion);
        }

        // Generar archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error al generar reporte Excel:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Descargar Reporte en PDF
exports.generarReportePDF = async (req, res) => {
    const { tipo, fechaInicio, fechaFin } = req.query;

    try {
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
        
        doc.pipe(res);

        doc.fontSize(20).text(`Reporte de ${tipo}`, { align: 'center' });
        doc.moveDown();

        if (tipo === 'ingresos') {
            const [ingresos] = await pool.execute(
                `SELECT p.Fecha_Pago, p.Monto_Pagado, c.Nombre, c.Apellido
                FROM Pago p
                JOIN Factura f ON p.ID_Factura = f.ID_Factura
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE p.Fecha_Pago BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            ingresos.forEach(ingreso => {
                doc.text(`Fecha: ${ingreso.Fecha_Pago} | Monto: ${ingreso.Monto_Pagado} | Cliente: ${ingreso.Nombre} ${ingreso.Apellido}`);
                doc.moveDown();
            });
        } else if (tipo === 'consumo') {
            const [consumos] = await pool.execute(
                `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio, con.Fecha_Fin, con.Litraje_Consumido
                FROM Consumo con
                JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
                WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            consumos.forEach(consumo => {
                doc.text(`Cliente: ${consumo.Nombre} ${consumo.Apellido} | Litraje: ${consumo.Litraje_Consumido}`);
                doc.moveDown();
            });
        } else if (tipo === 'facturacion') {
            const [facturacion] = await pool.execute(
                `SELECT f.ID_Factura, f.Fecha_Emision, f.Monto, f.Estado, c.Nombre, c.Apellido
                FROM Factura f
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE f.Fecha_Emision BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            facturacion.forEach(factura => {
                doc.text(`Factura ID: ${factura.ID_Factura} | Monto: ${factura.Monto} | Estado: ${factura.Estado} | Cliente: ${factura.Nombre} ${factura.Apellido}`);
                doc.moveDown();
            });
        }

        doc.end();
    } catch (err) {
        console.error('Error al generar reporte PDF:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
