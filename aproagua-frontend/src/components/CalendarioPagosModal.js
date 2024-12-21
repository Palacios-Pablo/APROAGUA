import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CalendarioPagosModal.css'; // Agrega estilos para el modal

const CalendarioPagosModal = ({ cliente, onClose }) => {
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [estadoPagos, setEstadoPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Nuevo: para mostrar estado de carga
    const [error, setError] = useState(null); // Nuevo: para manejar errores

    useEffect(() => {
        if (cliente) {
            obtenerPagos(cliente.ID_Cliente, anio);
        }
    }, [cliente, anio]);

    const obtenerPagos = async (idCliente, anio) => {
        setIsLoading(true); // Mostrar indicador de carga
        setError(null); // Limpiar errores previos
        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/facturas/pagos/${idCliente}/${anio}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') },
            });
            setEstadoPagos(res.data);
        } catch (err) {
            console.error('Error al obtener estado de pagos:', err);
            setError('No se pudieron cargar los datos. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false); // Ocultar indicador de carga
        }
    };

    const handleChangeAnio = (e) => {
        setAnio(e.target.value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Calendario de Pagos - {cliente?.Nombre} {cliente?.Apellido}</h2>
                <button onClick={onClose} className="close-btn">Cerrar</button>
                <div>
                    <label htmlFor="anio">Año:</label>
                    <select id="anio" value={anio} onChange={handleChangeAnio}>
                        {[2022, 2023, 2024, 2025].map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                {isLoading ? (
                    <p>Cargando datos...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : (
                    <div className="calendar-grid">
                        {estadoPagos.length > 0 ? (
                            estadoPagos.map((mes) => (
                                <div
                                    key={mes.mes}
                                    className={`calendar-month ${mes.estado === 'pagado' ? 'paid' : 'pending'}`}
                                >
                                    {`Mes ${mes.mes}`}
                                </div>
                            ))
                        ) : (
                            <p>No hay datos para mostrar.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarioPagosModal;
