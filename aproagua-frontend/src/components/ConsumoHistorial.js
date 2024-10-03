import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConsumoHistorial = ({ idCliente, onConsumoActualizado }) => {
    const [consumos, setConsumos] = useState([]);

    useEffect(() => {
        const obtenerConsumos = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/api/consumos/${idCliente}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setConsumos(res.data);
            } catch (err) {
                console.error('Error al obtener consumos', err);
            }
        };

        if (idCliente) {
            obtenerConsumos();
        }
    }, [idCliente, onConsumoActualizado]);

    const handleEliminar = async (idConsumo) => {
        if (window.confirm('¿Estás seguro de eliminar este consumo?')) {
            try {
                await axios.delete(`http://localhost:3000/api/consumos/${idConsumo}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setConsumos(consumos.filter(consumo => consumo.ID_Consumo !== idConsumo));
            } catch (err) {
                console.error('Error al eliminar consumo', err);
            }
        }
    };

    return (
        <div className="table-responsive">
            <h3>Historial de Consumo</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Litraje Consumido</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {consumos.map((consumo) => (
                        <tr key={consumo.ID_Consumo}>
                            <td>{consumo.Fecha_Inicio}</td>
                            <td>{consumo.Fecha_Fin}</td>
                            <td>{consumo.Litraje_Consumido} Litros</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => handleEliminar(consumo.ID_Consumo)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ConsumoHistorial;