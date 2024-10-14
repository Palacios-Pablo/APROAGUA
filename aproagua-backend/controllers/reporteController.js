// src/controllers/reporteController.js
const pool = require('../config/dbconfig');
const ExcelJS = require('exceljs');
const pdfMakePrinter = require('pdfmake');
const fs = require('fs');
const path = require('path');

// Cargar las fuentes Roboto manualmente
const fonts = {
    Roboto: {
        normal: path.join(__dirname, '../fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '../fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '../fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '../fonts/Roboto-MediumItalic.ttf')
    }
};

// Función para crear documentos PDF con estilos
function createPDFDocument(docDefinition) {
    return new Promise((resolve, reject) => {
        const printer = new pdfMakePrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const chunks = [];
        let result;

        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => {
            result = Buffer.concat(chunks);
            resolve(result);
        });
        pdfDoc.on('error', (err) => reject(err));

        pdfDoc.end();
    });
}

// Plantilla base para el encabezado y pie de página del PDF
function generarPlantillaPDF(titulo, data, columns) {
    return {
        content: [
            { text: 'Empresa XYZ - ' + titulo, style: 'header' },
            { text: new Date().toLocaleDateString(), alignment: 'right' },
            { text: '\n' }, // Espaciado
            {
                table: {
                    headerRows: 1,
                    widths: Array(columns.length).fill('*'),
                    body: [
                        columns.map(col => ({ text: col, style: 'tableHeader' })),
                        ...data.map(row => Object.values(row))
                    ]
                },
                layout: {
                    fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#f3f3f3' : null)
                }
            }
        ],
        footer: (currentPage, pageCount) => ({
            columns: [
                { text: 'Generado automáticamente', alignment: 'left' },
                { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right' }
            ],
            margin: [40, 0]
        }),
        styles: {
            header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 10] },
            tableHeader: { bold: true, fontSize: 13, color: 'white', fillColor: '#0070C0', alignment: 'center' },
            tableCell: { margin: [5, 5] }
        },
        defaultStyle: { font: 'Roboto' }
    };
}

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
        let data, columns, titulo;

        if (tipo === 'ingresos') {
            [data] = await pool.execute(
                `SELECT p.Fecha_Pago AS "Fecha de Pago", p.Monto_Pagado AS "Monto", c.Nombre, c.Apellido
                FROM Pago p
                JOIN Factura f ON p.ID_Factura = f.ID_Factura
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE p.Fecha_Pago BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            columns = ['Fecha de Pago', 'Monto', 'Nombre', 'Apellido'];
            titulo = 'Reporte de Ingresos';
        } else if (tipo === 'consumo') {
            [data] = await pool.execute(
                `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio AS "Fecha de Inicio", con.Fecha_Fin AS "Fecha Fin", con.Litraje_Consumido AS "Litraje Consumido"
                FROM Consumo con
                JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
                WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            columns = ['Nombre', 'Apellido', 'Fecha de Inicio', 'Fecha Fin', 'Litraje Consumido'];
            titulo = 'Reporte de Consumo';
        } else if (tipo === 'facturacion') {
            [data] = await pool.execute(
                `SELECT f.ID_Factura AS "ID Factura", f.Fecha_Emision AS "Fecha de Emisión", f.Monto, f.Estado, c.Nombre, c.Apellido
                FROM Factura f
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE f.Fecha_Emision BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            columns = ['ID Factura', 'Fecha de Emisión', 'Monto', 'Estado', 'Nombre', 'Apellido'];
            titulo = 'Reporte de Facturación';
        }

        // Generar el documento PDF con el estilo
        const docDefinition = generarPlantillaPDF(titulo, data, columns);
        const pdfBuffer = await createPDFDocument(docDefinition);

        // Descargar el archivo PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte_${tipo}.pdf`);
        res.end(pdfBuffer);
    } catch (err) {
        console.error('Error al generar reporte PDF:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
