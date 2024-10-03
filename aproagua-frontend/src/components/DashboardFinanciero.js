import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
} from 'chart.js';

// Registrar los componentes necesarios para los gráficos
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const DashboardFinanciero = () => {
    const [balances, setBalances] = useState([]);
    const [egresos, setEgresos] = useState([]);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [saldoFinal, setSaldoFinal] = useState(0);

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Obtener los balances, egresos y el saldo final al cargar el componente
    useEffect(() => {
        if (fechaInicio && fechaFin) {
            const obtenerDatosFinancieros = async () => {
                try {
                    // Obtener balances
                    const resBalances = await axios.get('http://localhost:3000/api/finanzas/balances', {
                        params: { fechaInicio, fechaFin },
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    setBalances(resBalances.data);

                    // Obtener egresos
                    const resEgresos = await axios.get('http://localhost:3000/api/finanzas/egresos', {
                        params: { fechaInicio, fechaFin },
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    setEgresos(resEgresos.data);

                    // Obtener total de ingresos
                    const resIngresos = await axios.get('http://localhost:3000/api/finanzas/ingresos', {
                        params: { fechaInicio, fechaFin },
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    setTotalIngresos(resIngresos.data.Total_Ingresos);

                    // Obtener saldo final
                    const resSaldo = await axios.get('http://localhost:3000/api/finanzas/saldo', {
                        headers: { 'x-auth-token': localStorage.getItem('token') }
                    });
                    setSaldoFinal(resSaldo.data.Saldo);

                } catch (err) {
                    console.error('Error al obtener datos financieros', err);
                }
            };

            obtenerDatosFinancieros();
        }
    }, [fechaInicio, fechaFin]);

    // Datos para el gráfico de barras (ingresos vs egresos)
    const datosGraficoBarras = {
        labels: balances.map(balance => balance.Fecha),
        datasets: [
            {
                label: 'Ingresos',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                data: balances.map(balance => balance.Total_Ingresos)
            },
            {
                label: 'Egresos',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                data: balances.map(balance => balance.Total_Egresos)
            }
        ]
    };

    // Datos para el gráfico de flujo de caja (línea)
    const datosGraficoFlujo = {
        labels: balances.map(balance => balance.Fecha),
        datasets: [
            {
                label: 'Saldo Final',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                data: balances.map(balance => balance.Saldo),
                fill: false,
                borderColor: 'rgba(54, 162, 235, 0.6)'
            }
        ]
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Dashboard Financiero</h1>

                    {/* Selección de rango de fechas */}
                    <div className="form-group">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>

                    {/* Gráfico de barras (Ingresos vs Egresos) */}
                    <div className="mb-4">
                        <h3>Ingresos vs Egresos</h3>
                        <Bar data={datosGraficoBarras} />
                    </div>

                    {/* Gráfico de flujo de caja (línea) */}
                    <div className="mb-4">
                        <h3>Flujo de Caja</h3>
                        <Line data={datosGraficoFlujo} />
                    </div>

                    {/* Tabla de balance financiero */}
                    <div className="table-responsive">
                        <h3>Balance Financiero</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Total Ingresos</th>
                                    <th>Total Egresos</th>
                                    <th>Saldo Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balances.map((balance, index) => (
                                    <tr key={index}>
                                        <td>{balance.Fecha}</td>
                                        <td>{balance.Total_Ingresos} USD</td>
                                        <td>{balance.Total_Egresos} USD</td>
                                        <td>{balance.Saldo} USD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detalles de egresos */}
                    <div className="table-responsive mt-4">
                        <h3>Detalles de Egresos</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {egresos.map((egreso, index) => (
                                    <tr key={index}>
                                        <td>{egreso.Fecha}</td>
                                        <td>{egreso.Descripcion}</td>
                                        <td>{egreso.Monto} USD</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen financiero */}
                    <div className="mt-4">
                        <h3>Resumen Financiero</h3>
                        <p>Total Ingresos: {totalIngresos} USD</p>
                        <p>Saldo Final: {saldoFinal} USD</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardFinanciero;
