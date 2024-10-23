import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import config from '../../config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement, // Registrar el ArcElement para los gráficos de torta
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Importación de FontAwesomeIcon e ícono de PDF
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';

import './DashboardGeneral.css';  // Estilos personalizados (opcional)

// Registrar los elementos de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,  // Registro del ArcElement
    Title,
    Tooltip,
    Legend
);

const DashboardGeneral = () => {
    const [clientes, setClientes] = useState([]);
    const [kpis, setKpis] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });


    useEffect(() => {
        // Obtener el resumen de clientes
        const obtenerClientes = async () => {
            try {
                const resClientes = await axios.get(`${config.API_BASE_URL}/api/dashboard/resumen-clientes`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClientes(resClientes.data);
            } catch (err) {
                console.error('Error al obtener clientes:', err);
            }
        };

        // Obtener los KPIs
        const obtenerKPIs = async () => {
            try {
                const resKpis = await axios.get(`${config.API_BASE_URL}/api/dashboard/kpis`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setKpis(resKpis.data);
            } catch (err) {
                console.error('Error al obtener KPIs:', err);
            }
        };

        Promise.all([obtenerClientes(), obtenerKPIs()]).then(() => setLoading(false));
    }, []);

    // Generar PDF del corte de cuenta
    const handleGenerarPDF = async (clienteId) => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/dashboard/generar-pdf/${clienteId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            alert(res.data.msg);  // Solo para mostrar un mensaje, se puede implementar la descarga del PDF
        } catch (err) {
            console.error('Error al generar el PDF:', err);
        }
    };

    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedClientes = [...clientes].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const filteredClientes = sortedClientes.filter(cliente =>
        cliente.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.Apellido.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentClientes = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    if (loading) {
        return <div>Cargando...</div>;
    }

    // Datos para el gráfico de torta (clientes al día vs clientes con pagos pendientes)
    const datosGraficoClientes = {
        labels: ['Clientes al Día', 'Clientes con Pagos Pendientes'],
        datasets: [
            {
                label: 'Clientes',
                data: [
                    kpis.totalClientes - kpis.clientesPendientes,  // Clientes al día
                    kpis.clientesPendientes  // Clientes con pagos pendientes
                ],
                backgroundColor: ['#36A2EB', '#FF6384']
            }
        ]
    };

    // Datos para el gráfico de barras (consumo de agua total del mes)
    const datosGraficoConsumo = {
        labels: ['Consumo Total de Agua'],
        datasets: [
            {
                label: 'Litros Consumidos',
                data: [kpis.litrosConsumidos],
                backgroundColor: ['#4BC0C0']
            }
        ]
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Dashboard General</h1>

                    {/* KPIs */}
                    <div className="row">
                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-info">
                                <div className="inner">
                                    <h3>{kpis.totalClientes}</h3>
                                    <p>Total de Clientes</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-danger">
                                <div className="inner">
                                    <h3>{kpis.clientesPendientes}</h3>
                                    <p>Clientes con Pagos Pendientes</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-success">
                                <div className="inner">
                                    <h3>Q. {kpis.ingresosMes} </h3>
                                    <p>Ingresos del Mes</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-6">
                            <div className="small-box bg-warning">
                                <div className="inner">
                                    <h3>{kpis.litrosConsumidos} L</h3>
                                    <p>Litros Consumidos en el Mes</p>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Tabla de clientes con paginación y ordenación */}
                    <h3>Resumen de Clientes</h3>

                    {/* Buscador */}
                    <                   div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('Nombre')}>Nombre</th>
                                    <th onClick={() => handleSort('Ultimo_Consumo')}>Litraje Consumido</th>
                                    <th>Número de Teléfono</th>
                                    <th onClick={() => handleSort('Zona')}>Sector</th>
                                    <th onClick={() => handleSort('Ultimo_Mes_Pagado')}>Último Pago Realizado</th>
                                    <th onClick={() => handleSort('Meses_Pendientes')}>Pagos Pendientes</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClientes.map((cliente, index) => (
                                    <tr key={index}>
                                        <td>{cliente.Nombre} {cliente.Apellido}</td>
                                        <td>{cliente.Ultimo_Consumo} L</td>
                                        <td>{cliente.Numero_Telefono}</td>
                                        <td>{cliente.Zona}</td>
                                        <td>{cliente.Ultimo_Mes_Pagado || 'N/A'}</td>
                                        <td>{cliente.Meses_Pendientes}</td>
                                        <td>
                                            <button
                                                className="btn-pdf1"
                                                onClick={() => handleGenerarPDF(cliente.ID_Cliente)}
                                            >
                                                <FontAwesomeIcon icon={faFilePdf} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className="charts-row">
                        {/* Gráfico de torta (clientes al día vs con pagos pendientes) */}
                        <div className="chart-container">
                            <h3>Estado de Clientes</h3>
                            <Pie data={datosGraficoClientes} />
                        </div>

                        {/* Gráfico de barras (consumo de agua total) */}
                        <div className="chart-container">
                            <h3>Consumo Total de Agua</h3>
                            <Bar data={datosGraficoConsumo} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DashboardGeneral;
