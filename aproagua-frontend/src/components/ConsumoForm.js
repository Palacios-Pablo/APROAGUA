import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsumoForm = ({ onConsumoRegistrado, onClienteSeleccionado }) => {
    const [clientes, setClientes] = useState([]);
    const [idCliente, setIdCliente] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [litrajeConsumido, setLitrajeConsumido] = useState('');

    // Obtener la lista de clientes para seleccionar
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

    // Notificar cuando se selecciona un cliente
    const handleClienteChange = (e) => {
        setIdCliente(e.target.value);
        onClienteSeleccionado(e.target.value);  // Notificar al padre
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:3000/api/consumos', {
                id_cliente: idCliente,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                litraje_consumido: litrajeConsumido
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            // Limpiar el formulario después de registrar el consumo
            setFechaInicio('');
            setFechaFin('');
            setLitrajeConsumido('');

            // Notificar al padre que el consumo fue registrado
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
                    onChange={handleClienteChange}  // Capturamos el cambio de cliente
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
