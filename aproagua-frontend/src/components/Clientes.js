import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faHistory, faTint, faReceipt} from '@fortawesome/free-solid-svg-icons';  // Icono de agua
import ClienteModal from './ClienteModal';
import AsignarTarifaModal from './AsignarTarifaModal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Para redireccionar a la página de consumo
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import './Clientes.css';

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

    const navigate = useNavigate();  // Hook para redireccionar

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/clientes', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClientes(res.data);
            } catch (err) {
                console.error('Error al obtener clientes', err);
            }
        };
        obtenerClientes();
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
                await axios.delete(`http://localhost:3000/api/clientes/${id_cliente}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClientes(clientes.filter(cliente => cliente.ID_Cliente !== id_cliente));
            } catch (err) {
                console.error('Error al eliminar cliente', err.response || err);
            }
        }
    };

    const handleAsignarTarifa = (cliente) => {
        setClienteParaTarifa(cliente);
        setIsTarifaModalOpen(true);
    };

    // Función para mostrar u ocultar historial
    const handleVerHistorialTarifas = async (id_cliente) => {
        if (visibleHistorial === id_cliente) {
            setVisibleHistorial(null);
            setHistorialTarifas([]);
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3000/api/clientes/${id_cliente}/historial-tarifas`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setHistorialTarifas(res.data);
            setVisibleHistorial(id_cliente);
        } catch (err) {
            console.error('Error al obtener el historial de tarifas', err);
        }
    };

    // Función para redirigir a la página de consumo con el cliente seleccionado
    const handleRegistrarConsumo = (cliente) => {
        navigate('/consumo', { state: { cliente } });  // Redirigir y pasar los datos del cliente
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

                    {/* Buscador */}
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {/* Tabla */}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('Nombre')}>Nombre</th>
                                    <th onClick={() => handleSort('Apellido')}>Apellido</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th onClick={() => handleSort('ID_Zona')}>Zona</th>
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
                                        <td>{cliente.ID_Zona}</td>
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
                                            <button className="btn btn-info" onClick={() => handleAsignarTarifa(cliente)}  data-tooltip-id="tooltip" data-tooltip-content="Asignar Tarifa">
                                                <FontAwesomeIcon icon={faReceipt} size="lg" /> 
                                            </button>
                                            {/* Botón para registrar consumo */}
                                            <button className="btn btn-consumo" onClick={() => handleRegistrarConsumo(cliente)} data-tooltip-id="tooltip" data-tooltip-content="Registrar Consumo">
                                                <FontAwesomeIcon icon={faTint} size="lg" /> {/* Ícono de agua */}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Historial de Tarifas */}
                    {visibleHistorial && (
                        <div className="historial-tarifas">
                            <h2>Historial de Tarifas</h2>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>ID Tarifa</th>
                                            <th>Descripción</th>
                                            <th>Fecha Inicio</th>
                                            <th>Fecha Fin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historialTarifas.map((tarifa) => (
                                            <tr key={tarifa.ID_Tarifa}>
                                                <td>{tarifa.ID_Tarifa}</td>
                                                <td>{tarifa.Descripcion}</td>
                                                <td>{tarifa.Fecha_Inicio}</td>
                                                <td>{tarifa.Fecha_Fin || 'Vigente'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

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

                    <ClienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cliente={clienteSeleccionado} />
                    <AsignarTarifaModal isOpen={isTarifaModalOpen} onClose={() => setIsTarifaModalOpen(false)} cliente={clienteParaTarifa} />
                </div>
            </section>
            {/* Renderizando el tooltip afuera de los botones */}
            <Tooltip id="tooltip" />
        </div>
    );
};

export default Clientes;
