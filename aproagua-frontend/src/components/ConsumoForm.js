// src/components/ConsumoForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const ConsumoForm = ({ onConsumoRegistrado, onClienteSeleccionado, clienteSeleccionado }) => {
    const [clientes, setClientes] = useState([]);
    const [idCliente, setIdCliente] = useState(clienteSeleccionado?.ID_Cliente || '');  // Preseleccionar cliente
    const [mesInicio, setMesInicio] = useState('');
    const [añoInicio, setAñoInicio] = useState('');
    const [mesFin, setMesFin] = useState('');
    const [añoFin, setAñoFin] = useState('');
    const [litrajeConsumido, setLitrajeConsumido] = useState('');

    useEffect(() => {
        const obtenerClientes = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/api/clientes`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setClientes(res.data);
            } catch (err) {
                console.error('Error al obtener clientes', err);
            }
        };
        obtenerClientes();
    }, []);

    // Actualizar cliente si se pasa como prop
    useEffect(() => {
        if (clienteSeleccionado) {
            setIdCliente(clienteSeleccionado.ID_Cliente);
        }
    }, [clienteSeleccionado]);

    const handleClienteChange = (e) => {
        setIdCliente(e.target.value);
        onClienteSeleccionado(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Asegurarse que los campos estén llenos
        if (!mesInicio || !añoInicio || !mesFin || !añoFin) {
            alert('Debes seleccionar mes y año para el inicio y el fin.');
            return;
        }

        try {
            await axios.post(`${config.API_BASE_URL}/api/consumos`, {
                id_cliente: idCliente,
                mes_inicio: mesInicio,
                año_inicio: añoInicio,
                mes_fin: mesFin,
                año_fin: añoFin,
                litraje_consumido: litrajeConsumido
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            // Limpiar los campos después de registrar
            setMesInicio('');
            setAñoInicio('');
            setMesFin('');
            setAñoFin('');
            setLitrajeConsumido('');

            if (onConsumoRegistrado) onConsumoRegistrado();
        } catch (err) {
            console.error('Error al registrar consumo', err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Cliente</label>
                <select
                    className="form-control"
                    value={idCliente}
                    onChange={handleClienteChange}
                    required
                >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.ID_Cliente} value={cliente.ID_Cliente}>
                            {cliente.Nombre} {cliente.Apellido}
                        </option>
                    ))}
                </select>
            </div>

            {/* Selector de Mes y Año de Inicio */}
            <div className="form-group">
                <label>Mes de Inicio</label>
                <select
                    className="form-control"
                    value={mesInicio}
                    onChange={(e) => setMesInicio(e.target.value)}
                    required
                >
                    <option value="">Seleccionar mes</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <label>Año de Inicio</label>
                <input
                    type="number"
                    className="form-control"
                    value={añoInicio}
                    onChange={(e) => setAñoInicio(e.target.value)}
                    required
                />
            </div>

            {/* Selector de Mes y Año de Fin */}
            <div className="form-group">
                <label>Mes de Fin</label>
                <select
                    className="form-control"
                    value={mesFin}
                    onChange={(e) => setMesFin(e.target.value)}
                    required
                >
                    <option value="">Seleccionar mes</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <label>Año de Fin</label>
                <input
                    type="number"
                    className="form-control"
                    value={añoFin}
                    onChange={(e) => setAñoFin(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Litraje Consumido</label>
                <input
                    type="number"
                    className="form-control"
                    value={litrajeConsumido}
                    onChange={(e) => setLitrajeConsumido(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">Registrar Consumo</button>
        </form>
    );
};

export default ConsumoForm;
