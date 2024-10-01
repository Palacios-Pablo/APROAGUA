// src/components/Clientes.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ClienteModal from './ClienteModal';
import axios from 'axios';  // Para hacer peticiones al backend
import './Clientes.css';


const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

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

    const handleEliminarCliente = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:3000/api/clientes/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClientes(clientes.filter(cliente => cliente.ID_Cliente !== id));
            } catch (err) {
                console.error('Error al eliminar cliente', err);
            }
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ClienteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cliente={clienteSeleccionado} />
                </div>
                </div>
            </section>
        </div>
    );
};

export default Clientes;
