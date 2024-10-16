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
            { text: 'APROAGUA - ' + titulo, style: 'header' },
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

// Generar Reporte de Egresos
exports.generarReporteEgresos = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        // Consulta SQL para obtener egresos entre las fechas dadas
        const [result] = await pool.execute(
            `SELECT e.Fecha, e.Descripcion, e.Monto
            FROM Egreso e
            WHERE e.Fecha BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );

        res.status(200).json(result);
    } catch (err) {
        console.error('Error al generar reporte de egresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

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
        // Consulta SQL para obtener los datos de consumo entre las fechas dadas
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
        console.log('Consulta SQL result: ', result);
    }
};

// Generar Reporte de Facturación
exports.generarReporteFacturacion = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT f.Fecha_Emision, f.Monto, f.Estado, c.Nombre, c.Apellido
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

        // Encabezado Profesional: Celdas combinadas para el título
        const titleRange = `A1:D1`;  // Cambia este rango según el número de columnas
        sheet.mergeCells(titleRange);
        const titleCell = sheet.getCell('A1');
        titleCell.value = `APROAGUA - Reporte de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
        titleCell.font = { size: 16, bold: true };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        titleCell.height = 20;

        // Espaciado en la fila 2
        sheet.getRow(2).height = 15;

        // Definir columnas y datos según el tipo de reporte
        let columns, data, columnWidths, numberColumns;

        if (tipo === 'ingresos') {
            columns = ['Fecha de Pago', 'Monto Pagado', 'Nombre Cliente', 'Apellido Cliente'];
            columnWidths = [20, 15, 25, 25];  // Anchos para cada columna
            numberColumns = [1];  // Índice de la columna de "Monto Pagado" que es numérica
            const [result] = await pool.execute(
                `SELECT p.Fecha_Pago, p.Monto_Pagado, c.Nombre, c.Apellido
                FROM Pago p
                JOIN Factura f ON p.ID_Factura = f.ID_Factura
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE p.Fecha_Pago BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            data = result;
        } else if (tipo === 'consumo') {
            columns = ['Nombre Cliente', 'Apellido Cliente', 'Fecha Inicio', 'Fecha Fin', 'Litraje Consumido'];
            columnWidths = [25, 25, 20, 20, 20];  // Anchos para cada columna
            numberColumns = [4];  // Índice de la columna de "Litraje Consumido" que es numérica
            const [result] = await pool.execute(
                `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio, con.Fecha_Fin, con.Litraje_Consumido
                FROM Consumo con
                JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
                WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            data = result;
        } else if (tipo === 'facturacion') {
            // Eliminar "ID Factura" de los encabezados y datos
            columns = ['Fecha Emisión', 'Monto', 'Estado', 'Nombre Cliente', 'Apellido Cliente']; // Sin "ID Factura"
            columnWidths = [20, 15, 15, 25, 25];  // Ajuste de anchos para las columnas restantes
            numberColumns = [1];  // Índice de la columna de "Monto" que es numérica
            const [result] = await pool.execute(
                `SELECT f.Fecha_Emision, f.Monto, f.Estado, c.Nombre, c.Apellido
                FROM Factura f
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE f.Fecha_Emision BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            data = result;
        } else if (tipo === 'egresos') {
            columns = ['Fecha', 'Descripción', 'Monto'];
            columnWidths = [20, 40, 15];  // Anchos para cada columna
            numberColumns = [2];  // Índice de la columna de "Monto" que es numérica
            const [result] = await pool.execute(
                `SELECT e.Fecha, e.Descripcion, e.Monto
                FROM Egreso e
                WHERE e.Fecha BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
            data = result;
        } else {
            throw new Error('Tipo de reporte no válido');
        }

        // Agregar encabezado de la tabla en la fila 3
        const headerRow = sheet.addRow(columns);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // Letra blanca
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } }; // Fondo celeste oscuro
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Establecer el ancho de las columnas
        sheet.columns.forEach((col, index) => {
            col.width = columnWidths[index];
        });

        // Agregar los datos de la tabla comenzando en la fila 4
        data.forEach((row, index) => {
            const values = Object.values(row).map((val, idx) => {
                // Si la columna es numérica, asegúrate de que el valor sea un número
                return numberColumns.includes(idx) ? parseFloat(val) : val;
            });

            const excelRow = sheet.addRow(values); // Agregar fila de datos
            const fillColor = index % 2 === 0 ? 'DAEEF3' : 'FFFFFFFF'; // Alternar colores
            excelRow.eachCell((cell, colNumber) => {
                // Si la celda es numérica, aplica formato de número
                if (numberColumns.includes(colNumber - 1)) {
                    cell.numFmt = '#,##0.00';  // Formato de número con dos decimales
                }
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Generar archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error('Error al generar reporte Excel:', err.message);
        res.status(500).json({ msg: 'Error del servidor', error: err.message });
    }
};


// Descargar Reporte en PDF
exports.generarReportePDF = async (req, res) => {
    const { tipo, fechaInicio, fechaFin } = req.query;

    try {
        let data, columns, titulo;

        if (tipo === 'ingresos') {
            const [result] = await pool.execute(
                `SELECT p.Fecha_Pago AS "Fecha_Pago", p.Monto_Pagado AS "Monto", c.Nombre, c.Apellido
                FROM Pago p
                JOIN Factura f ON p.ID_Factura = f.ID_Factura
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE p.Fecha_Pago BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );

            // Formatear la fecha y mapear los datos para el PDF
            data = result.map(row => ({
                'Fecha de Pago': row.Fecha_Pago ? new Date(row.Fecha_Pago).toLocaleDateString() : 'N/A',
                'Monto': parseFloat(row.Monto).toFixed(2), // Convertir a número y formatear
                'Nombre': row.Nombre,
                'Apellido': row.Apellido
            }));
            
            columns = ['Fecha de Pago', 'Monto', 'Nombre', 'Apellido'];
            titulo = 'Reporte de Ingresos';
        } else if (tipo === 'consumo') {
            const [result] = await pool.execute(
                `SELECT c.Nombre, c.Apellido, con.Fecha_Inicio AS "Fecha_Inicio", con.Fecha_Fin AS "Fecha_Fin", con.Litraje_Consumido AS "Litraje_Consumido"
                FROM Consumo con
                JOIN Cliente c ON con.ID_Cliente = c.ID_Cliente
                WHERE con.Fecha_Inicio BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );
        
            // Validar y mapear los datos para el PDF
            data = result.map(row => ({
                'Nombre': row.Nombre,
                'Apellido': row.Apellido,
                'Fecha de Inicio': row.Fecha_Inicio ? new Date(row.Fecha_Inicio).toLocaleDateString() : 'N/A',
                'Fecha Fin': row.Fecha_Fin ? new Date(row.Fecha_Fin).toLocaleDateString() : 'N/A',
                'Litraje Consumido': row.Litraje_Consumido ? parseFloat(row.Litraje_Consumido).toFixed(2) : '0.00'
            }));
        
            columns = ['Nombre', 'Apellido', 'Fecha de Inicio', 'Fecha Fin', 'Litraje Consumido'];
            titulo = 'Reporte de Consumo';
        } else if (tipo === 'facturacion') {
            const [result] = await pool.execute(
                `SELECT f.Fecha_Emision AS "Fecha_Emision", f.Monto, f.Estado, c.Nombre, c.Apellido
                FROM Factura f
                JOIN Cliente c ON f.ID_Cliente = c.ID_Cliente
                WHERE f.Fecha_Emision BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );

            data = result.map(row => ({
                'Fecha de Emisión': row.Fecha_Emision ? new Date(row.Fecha_Emision).toLocaleDateString() : 'N/A',
                'Monto': parseFloat(row.Monto).toFixed(2), // Convertir a número y formatear
                'Estado': row.Estado,
                'Nombre': row.Nombre,
                'Apellido': row.Apellido
            }));
            
            columns = ['Fecha de Emisión', 'Monto', 'Estado', 'Nombre', 'Apellido'];
            titulo = 'Reporte de Facturación';
        }else if (tipo === 'egresos') {
            const [result] = await pool.execute(
                `SELECT e.Fecha AS "Fecha", e.Descripcion AS "Descripcion", e.Monto AS "Monto"
                FROM Egreso e
                WHERE e.Fecha BETWEEN ? AND ?`,
                [fechaInicio, fechaFin]
            );

            // Mapear los datos asegurando que la descripción se mapee correctamente
            data = result.map(row => ({
                'Fecha': row.Fecha ? new Date(row.Fecha).toLocaleDateString() : 'N/A',
                'Descripcion': row.Descripcion ? row.Descripcion : 'Sin Descripción',  // Asignar 'Sin Descripción' si no existe
                'Monto': row.Monto !== undefined ? parseFloat(row.Monto).toFixed(2) : '0.00'  // Asegurar que el monto esté definido
            }));

            columns = ['Fecha', 'Descripcion', 'Monto'];
            titulo = 'Reporte de Egresos';
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
