// src/components/ClienteModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import config from '../config';

const ClienteModal = ({ isOpen, onClose, cliente, onClienteGuardado }) => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [numeroTelefono, setNumeroTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [zona, setZona] = useState('');

    useEffect(() => {
        if (cliente) {
            setNombre(cliente.Nombre);
            setApellido(cliente.Apellido);
            setNumeroTelefono(cliente.Numero_Telefono);
            setDireccion(cliente.Direccion);
            setZona(cliente.ID_Zona);
        } else {
            // Resetear el formulario si no hay cliente seleccionado (es un nuevo cliente)
            setNombre('');
            setApellido('');
            setNumeroTelefono('');
            setDireccion('');
            setZona('');
        }
    }, [cliente]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevoCliente = {
            nombre,
            apellido,
            numero_telefono: numeroTelefono,
            direccion,
            id_zona: zona
        };

        try {
            if (cliente) {
                // Editar cliente
                await axios.put(`${config.API_BASE_URL}/api/clientes/${cliente.ID_Cliente}`, nuevoCliente, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
            } else {
                // Crear cliente
                await axios.post(`${config.API_BASE_URL}/api/clientes`, nuevoCliente, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
            }

            onClose();  // Cerrar el modal después de crear/editar el cliente
            onClienteGuardado();  // Refrescar la lista de clientes
        } catch (err) {
            console.error('Error al guardar cliente', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Cliente Modal">
            <h2>{cliente ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        value={numeroTelefono}
                        onChange={(e) => setNumeroTelefono(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Zona</label>
                    <select
                        className="form-control"
                        value={zona}
                        onChange={(e) => setZona(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una Zona</option>
                        <option value="1">Zaculeu Capilla</option>
                        <option value="2">Zaculeu Ruinas</option>
                        <option value="3">Zaculeu la Cruz</option>
                        <option value="4">El Terrero</option>
                    </select>
                </div>
                <div className="modal-buttons">
                    <button type="submit" className="modal-btn-primary">Guardar</button>
                    <button type="button" className="modal-btn-secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default ClienteModal;
