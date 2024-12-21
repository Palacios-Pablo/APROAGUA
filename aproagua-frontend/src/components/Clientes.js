// src/components/Clientes.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faHistory, faTint, faReceipt, faCalendar } from '@fortawesome/free-solid-svg-icons';
import ClienteModal from './ClienteModal';
import AsignarTarifaModal from './AsignarTarifaModal';
import CalendarioPagosModal from './CalendarioPagosModal'; // Importa el nuevo componente
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './Clientes.css';
import config from '../config';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTarifaModalOpen, setIsTarifaModalOpen] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clienteParaTarifa, setClienteParaTarifa] = useState(null);
    const [historialTarifas, setHistorialTarifas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [visibleHistorial, setVisibleHistorial] = useState(null);

    // Estado para el modal de calendario
    const [isCalendarioOpen, setIsCalendarioOpen] = useState(false);
    const [clienteParaCalendario, setClienteParaCalendario] = useState(null);

    const navigate = useNavigate();

    // Función para obtener clientes desde la API
    const fetchClientes = async () => {
        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/clientes`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setClientes(res.data);
        } catch (err) {
            console.error('Error al obtener clientes', err);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleAgregarCliente = () => {
        setClienteSeleccionado(null);
        setIsModalOpen(true);
    };

    const handleEditarCliente = (cliente) => {
        setClienteSeleccionado(cliente);
        setIsModalOpen(true);
    };

    const handleEliminarCliente = async (id_cliente) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}/api/clientes/${id_cliente}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                fetchClientes();  // Refrescar la lista de clientes después de eliminar
            } catch (err) {
                console.error('Error al eliminar cliente', err.response || err);
            }
        }
    };

    const handleAsignarTarifa = (cliente) => {
        setClienteParaTarifa(cliente);
        setIsTarifaModalOpen(true);
    };

    const handleVerHistorialTarifas = async (id_cliente) => {
        if (visibleHistorial === id_cliente) {
            setVisibleHistorial(null);
            setHistorialTarifas([]);
            return;
        }

        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/clientes/${id_cliente}/historial-tarifas`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setHistorialTarifas(res.data);
            setVisibleHistorial(id_cliente);
        } catch (err) {
            console.error('Error al obtener el historial de tarifas', err);
        }
    };

    const handleRegistrarConsumo = (cliente) => {
        navigate('/consumo', { state: { cliente } });
    };

    const handleAbrirCalendario = (cliente) => {
        setClienteParaCalendario(cliente);
        setIsCalendarioOpen(true);
    };

    const handleCerrarCalendario = () => {
        setClienteParaCalendario(null);
        setIsCalendarioOpen(false);
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

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Clientes</h1>
                    <button className="btn btn-primary mb-3" onClick={handleAgregarCliente}>Agregar Cliente</button>

                    <div className="search-container">
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
                                    <th onClick={() => handleSort('Apellido')}>Apellido</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th onClick={() => handleSort('ID_Zona')}>Sector</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentClientes.map(cliente => (
                                    <tr key={cliente.ID_Cliente}>
                                        <td>{cliente.Nombre}</td>
                                        <td>{cliente.Apellido}</td>
                                        <td>{cliente.Numero_Telefono}</td>
                                        <td>{cliente.Direccion}</td>
                                        <td>{cliente.Nombre_Zona}</td>
                                        <td>
                                            <button className="btn btn-warning" onClick={() => handleEditarCliente(cliente)} data-tooltip-id="tooltip" data-tooltip-content="Editar Cliente">
                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                            </button>
                                            <button className="btn btn-danger" onClick={() => handleEliminarCliente(cliente.ID_Cliente)} data-tooltip-id="tooltip" data-tooltip-content="Eliminar Cliente">
                                                <FontAwesomeIcon icon={faTrashAlt} size="lg" />
                                            </button>
                                            <button className="btn btn-history" onClick={() => handleVerHistorialTarifas(cliente.ID_Cliente)} data-tooltip-id="tooltip" data-tooltip-content="Ver Historial de Tarifas">
                                                <FontAwesomeIcon icon={faHistory} size="lg" />
                                            </button>
                                            <button className="btn btn-info" onClick={() => handleAsignarTarifa(cliente)} data-tooltip-id="tooltip" data-tooltip-content="Asignar Tarifa">
                                                <FontAwesomeIcon icon={faReceipt} size="lg" />
                                            </button>
                                            <button className="btn btn-calendar" onClick={() => handleAbrirCalendario(cliente)} data-tooltip-id="tooltip" data-tooltip-content="Calendario de Pagos">
                                                <FontAwesomeIcon icon={faCalendar} size="lg" />
                                            </button>
                                            <button className="btn btn-consumo" onClick={() => handleRegistrarConsumo(cliente)} data-tooltip-id="tooltip" data-tooltip-content="Registrar Consumo">
                                                <FontAwesomeIcon icon={faTint} size="lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {visibleHistorial && (
                        <div className="historial-tarifas">
                            <h2>Historial de Tarifas</h2>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Descripción</th>
                                            <th>Fecha Inicio</th>
                                            <th>Fecha Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historialTarifas.map((tarifa) => (
                                            <tr key={tarifa.ID_Tarifa}>
                                                <td>{tarifa.Descripcion} - Q{tarifa.Precio_Por_Litro}</td>
                                                <td>{tarifa.Fecha_Inicio}</td>
                                                <td>{tarifa.Fecha_Fin || 'Vigente'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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

                    <ClienteModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        cliente={clienteSeleccionado}
                        onClienteGuardado={fetchClientes}  // Refrescar la lista de clientes después de guardar
                    />
                    <AsignarTarifaModal isOpen={isTarifaModalOpen} onClose={() => setIsTarifaModalOpen(false)} cliente={clienteParaTarifa} />
                    
                    {/* Modal para el calendario */}
                    {isCalendarioOpen && (
                        <CalendarioPagosModal
                            cliente={clienteParaCalendario}
                            onClose={handleCerrarCalendario}
                        />
                    )}
                </div>
            </section>
            <Tooltip id="tooltip" />
        </div>
    );
};

export default Clientes;
