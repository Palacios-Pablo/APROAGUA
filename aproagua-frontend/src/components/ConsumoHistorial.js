import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';  // Icono de agua
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from '../../config';

const ConsumoHistorial = ({ idCliente, onConsumoActualizado }) => {
    const [consumos, setConsumos] = useState([]);

    useEffect(() => {
        const obtenerConsumos = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/api/consumos/${idCliente}`, {
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
                await axios.delete(`${config.API_BASE_URL}/api/consumos/${idConsumo}`, {
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
                                    <FontAwesomeIcon icon={faTrashAlt} size="lg" />
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
