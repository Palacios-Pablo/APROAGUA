// src/controllers/finanzasController.js
const pool = require('../config/dbconfig');

// Obtener los balances financieros en un rango de fechas
exports.obtenerBalances = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT Fecha, Total_Ingresos, Total_Egresos, Saldo
            FROM Balance
            WHERE Fecha BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al obtener balances:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener los detalles de los egresos
exports.obtenerEgresos = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT Fecha, Descripcion, Monto
            FROM Egreso
            WHERE Fecha BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al obtener egresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener los ingresos totales
exports.obtenerIngresosTotales = async (req, res) => {
    const { fechaInicio, fechaFin } = req.query;

    try {
        const [result] = await pool.execute(
            `SELECT SUM(Monto_Pagado) as Total_Ingresos
            FROM Pago
            WHERE Fecha_Pago BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al obtener ingresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener el saldo final
exports.obtenerSaldoFinal = async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT Saldo FROM Balance ORDER BY Fecha DESC LIMIT 1`
        );
        res.status(200).json(result[0] || { Saldo: 0 });
    } catch (err) {
        console.error('Error al obtener saldo final:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
