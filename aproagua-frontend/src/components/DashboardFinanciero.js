import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import config from '../../config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardFinanciero = () => {
    const [balanceGeneral, setBalanceGeneral] = useState({ Total_Ingresos: 0, Total_Egresos: 0, Saldo: 0 });
    const [egresos, setEgresos] = useState([]);
    const [ingresos, setIngresos] = useState([]); // Para almacenar los pagos (Ingresos)
    const [loading, setLoading] = useState(true);

    // Obtener el balance general, egresos y los detalles de ingresos (pagos)
    useEffect(() => {
        const obtenerDatosFinancieros = async () => {
            try {
                setLoading(true);

                // Obtener balance general
                const resBalance = await axios.get(`${config.API_BASE_URL}/api/finanzas/balance-general`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setBalanceGeneral(resBalance.data);

                // Obtener egresos
                const resEgresos = await axios.get(`${config.API_BASE_URL}/api/finanzas/egresos`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setEgresos(resEgresos.data);

                // Obtener detalles de ingresos (historial de pagos)
                const resIngresos = await axios.get(`${config.API_BASE_URL}/api/finanzas/ingresos-detalles`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setIngresos(resIngresos.data);

                setLoading(false);
            } catch (err) {
                console.error('Error al obtener datos financieros', err);
                setLoading(false);
            }
        };

        obtenerDatosFinancieros();
    }, []);

    if (loading) {
        return <p>Cargando datos financieros...</p>;
    }

    const datosGraficoBarras = {
        labels: ['Ingresos', 'Egresos'],
        datasets: [
            {
                label: 'Monto en Quetzales',
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                data: [balanceGeneral.Total_Ingresos, balanceGeneral.Total_Egresos]
            }
        ]
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Dashboard Financiero</h1>

                    {/* Gráfico de barras (Ingresos vs Egresos) */}
                    <div className="mb-4">
                        <h3>Ingresos vs Egresos</h3>
                        <Bar data={datosGraficoBarras} />
                    </div>

                    {/* Tabla de balance financiero */}
                    <div className="table-responsive">
                        <h3>Balance Financiero</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Total Ingresos</th>
                                    <th>Total Egresos</th>
                                    <th>Saldo Final</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Q. {balanceGeneral.Total_Ingresos} </td>
                                    <td>Q. {balanceGeneral.Total_Egresos} </td>
                                    <td>Q. {balanceGeneral.Saldo} </td>
                                </tr>
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
                                        <td>Q. {egreso.Monto} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Detalles de ingresos (Pagos) */}
                    <div className="table-responsive mt-4">
                        <h3>Detalles de Ingresos</h3>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha de Pago</th>
                                    <th>Cliente</th>
                                    <th>Monto Pagado</th>

                                </tr>
                            </thead>
                            <tbody>
                                {ingresos.map((ingreso, index) => (
                                    <tr key={index}>
                                        <td>{ingreso.Fecha_Pago}</td>
                                        <td>{ingreso.Nombre} {ingreso.Apellido}</td>
                                        <td>Q. {ingreso.Monto_Pagado}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen financiero */}
                    <div className="mt-4">
                        <h3>Resumen Financiero</h3>
                        <p>Total Ingresos: Q. {balanceGeneral.Total_Ingresos}</p>
                        <p>Total Egresos: Q. {balanceGeneral.Total_Egresos}</p>
                        <p>Saldo Final: Q. {balanceGeneral.Saldo}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardFinanciero;
