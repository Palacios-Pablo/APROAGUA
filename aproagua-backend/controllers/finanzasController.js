// src/controllers/finanzasController.js
const pool = require('../config/dbconfig');

// Obtener el balance general sin fechas (ya que solo será un balance)
exports.obtenerBalanceGeneral = async (req, res) => {
    try {
        // No necesitamos filtrar por fecha, ya que solo habrá un balance general
        const [result] = await pool.execute(
            `SELECT Total_Ingresos, Total_Egresos, (Total_Ingresos - Total_Egresos) AS Saldo FROM Balance WHERE ID_Balance = 1`
        );
        res.status(200).json(result[0] || { Total_Ingresos: 0, Total_Egresos: 0, Saldo: 0 });
    } catch (err) {
        console.error('Error al obtener el balance general:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener los detalles de los egresos (mantener la lógica existente)
exports.obtenerEgresos = async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT Fecha, Descripcion, Monto FROM Egreso`
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Error al obtener egresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener los ingresos totales (mantener la lógica existente)
exports.obtenerIngresosTotales = async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT SUM(Monto_Pagado) AS Total_Ingresos FROM Pago`
        );
        res.status(200).json(result[0] || { Total_Ingresos: 0 });
    } catch (err) {
        console.error('Error al obtener ingresos:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Obtener el saldo final (mantener la lógica existente)
exports.obtenerSaldoFinal = async (req, res) => {
    try {
        const [result] = await pool.execute(
            `SELECT (Total_Ingresos - Total_Egresos) AS Saldo FROM Balance WHERE ID_Balance = 1`
        );
        res.status(200).json(result[0] || { Saldo: 0 });
    } catch (err) {
        console.error('Error al obtener saldo final:', err);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};
