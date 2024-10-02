import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faHistory } from '@fortawesome/free-solid-svg-icons';
import ClienteModal from './ClienteModal';
import AsignarTarifaModal from './AsignarTarifaModal';  // Nuevo modal para asignar tarifas
import axios from 'axios';  // Para hacer peticiones al backend
import './Clientes.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTarifaModalOpen, setIsTarifaModalOpen] = useState(false);  // Nuevo estado para el modal de tarifas
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [clienteParaTarifa, setClienteParaTarifa] = useState(null);  // Cliente al que se asignará la tarifa
    const [historialTarifas, setHistorialTarifas] = useState([]);  // Historial de tarifas

    // Obtener todos los clientes al cargar el componente
    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/clientes', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }  // Asegúrate de enviar el token JWT
                });
                setClientes(res.data);
            } catch (err) {
                console.error('Error al obtener clientes', err);
            }
        };
        obtenerClientes();
    }, []);

    const handleAgregarCliente = () => {
        setClienteSeleccionado(null);  // No hay cliente seleccionado, es un nuevo cliente
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
                console.error('Error al eliminar cliente', err.response || err);  // Imprimir más detalles del error
            }
        }
    };
    

    const handleAsignarTarifa = (cliente) => {
        setClienteParaTarifa(cliente);
        setIsTarifaModalOpen(true);  // Abrir el modal de asignar tarifa
    };

    // Función para obtener el historial de tarifas de un cliente
    const handleVerHistorialTarifas = async (id_cliente) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/clientes/${id_cliente}/historial-tarifas`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setHistorialTarifas(res.data);
        } catch (err) {
            console.error('Error al obtener el historial de tarifas', err);
        }
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Clientes</h1>
                    <button className="btn btn-primary mb-3" onClick={handleAgregarCliente}>Agregar Cliente</button>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Zona</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map(cliente => (
                                    <tr key={cliente.ID_Cliente}>
                                        <td>{cliente.Nombre}</td>
                                        <td>{cliente.Apellido}</td>
                                        <td>{cliente.Numero_Telefono}</td>
                                        <td>{cliente.Direccion}</td>
                                        <td>{cliente.ID_Zona}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => handleEditarCliente(cliente)}
                                            >
                                                <FontAwesomeIcon icon={faEdit} size="lg" /> {/* Icono de edición */}
                                            </button>
                                            <button 
                                                className="btn btn-danger"
                                                onClick={() => handleEliminarCliente(cliente.ID_Cliente)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} size="lg" /> {/* Icono de eliminar */}
                                            </button>

                                            <button
                                                className="btn btn-history"
                                                onClick={() => handleVerHistorialTarifas(cliente.ID_Cliente)}
                                            >
                                                <FontAwesomeIcon icon={faHistory} size="lg" /> {/* Icono de historial */}
                                            </button>
                                            <button
                                                className="btn btn-info"
                                                onClick={() => handleAsignarTarifa(cliente)}
                                            >
                                                Asignar Tarifa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Mostrar el historial de tarifas si se selecciona un cliente */}
                    {historialTarifas.length > 0 && (
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

                    <ClienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cliente={clienteSeleccionado} />
                    <AsignarTarifaModal isOpen={isTarifaModalOpen} onClose={() => setIsTarifaModalOpen(false)} cliente={clienteParaTarifa} />  {/* Modal para asignar tarifa */}
                </div>
            </section>
        </div>
    );
};

export default Clientes;
