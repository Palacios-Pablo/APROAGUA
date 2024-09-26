const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs'); 
const pool = require('../config/dbConfig');


// Generar un reporte en Excel para los clientes
exports.generarReporteClientesExcel = async (req, res) => {
    try {
        // Obtener los datos de los clientes desde la base de datos
        const [clientes] = await pool.execute('SELECT * FROM Cliente');

        // Crear un nuevo libro de trabajo Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Clientes');

        // Definir las columnas en el archivo Excel
        worksheet.columns = [
            { header: 'ID Cliente', key: 'ID_Cliente', width: 10 },
            { header: 'Nombre', key: 'Nombre', width: 30 },
            { header: 'Apellido', key: 'Apellido', width: 30 },
            { header: 'Teléfono', key: 'Numero_Telefono', width: 20 },
            { header: 'Dirección', key: 'Direccion', width: 50 },
        ];

        // Agregar los datos de los clientes al archivo Excel
        clientes.forEach((cliente) => {
            worksheet.addRow({
                ID_Cliente: cliente.ID_Cliente,
                Nombre: cliente.Nombre,
                Apellido: cliente.Apellido,
                Numero_Telefono: cliente.Numero_Telefono,
                Direccion: cliente.Direccion,
            });
        });

        // Configurar los headers para enviar el archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="reporte_clientes.xlsx"');

        // Escribir el archivo Excel en la respuesta
        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error('Error al generar el reporte Excel:', err);
        res.status(500).json({ msg: 'Error al generar el reporte' });
    }
};


// Generar un reporte en PDF para los clientes
exports.generarReporteClientesPDF = async (req, res) => {
    try {
        // Obtener los datos de los clientes desde la base de datos
        const [clientes] = await pool.execute('SELECT * FROM Cliente');

        // Crear un documento PDF
        const doc = new PDFDocument();
        let filename = 'reporte_clientes.pdf';
        filename = encodeURIComponent(filename);
        
        // Configurar los headers para enviar el archivo PDF
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Escribir el contenido en el PDF
        doc.text('Reporte de Clientes', { align: 'center' });
        doc.moveDown();
        
        clientes.forEach((cliente) => {
            doc.text(`ID: ${cliente.ID_Cliente}`);
            doc.text(`Nombre: ${cliente.Nombre} ${cliente.Apellido}`);
            doc.text(`Teléfono: ${cliente.Numero_Telefono}`);
            doc.text(`Dirección: ${cliente.Direccion}`);
            doc.text('---------------------------');
            doc.moveDown();
        });

        // Finalizar y enviar el documento PDF
        doc.pipe(res);
        doc.end();

    } catch (err) {
        console.error('Error al generar el reporte PDF:', err);
        res.status(500).json({ msg: 'Error al generar el reporte' });
    }
};
