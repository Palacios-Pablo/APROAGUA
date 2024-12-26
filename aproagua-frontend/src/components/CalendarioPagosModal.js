import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import './CalendarioPagosModal.css'; // Asegúrate de incluir este archivo

const CalendarioPagosModal = ({ cliente, onClose }) => {
    const [anio, setAnio] = useState(new Date().getFullYear());
    const [estadoPagos, setEstadoPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Nuevo: para mostrar estado de carga
    const [error, setError] = useState(null); // Nuevo: para manejar errores

    const mesesAbreviados = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    useEffect(() => {
        if (cliente) {
            obtenerPagos(cliente.ID_Cliente, anio);
        }
    }, [cliente, anio]);

    const obtenerPagos = async (idCliente, anio) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${config.API_BASE_URL}/api/facturas/pagos/${idCliente}/${anio}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') },
            });
            setEstadoPagos(res.data);
        } catch (err) {
            console.error('Error al obtener estado de pagos:', err);
            setError('No se pudieron cargar los datos. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeAnio = (e) => {
        const input = e.target.value;
        if (/^\d{0,4}$/.test(input)) {
            setAnio(input || new Date().getFullYear());
        }
    };

    const handleIncrementAnio = () => {
        setAnio(prev => parseInt(prev) + 1);
    };

    const handleDecrementAnio = () => {
        setAnio(prev => parseInt(prev) - 1);
    };

    const handleScrollAnio = (e) => {
        if (e.deltaY < 0) {
            handleIncrementAnio(); // Scroll hacia arriba
        } else {
            handleDecrementAnio(); // Scroll hacia abajo
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Calendario de Pagos - {cliente?.Nombre} {cliente?.Apellido}</h2>
                <button onClick={onClose} className="close-btn">Cerrar</button>
                <div className="year-picker-container" onWheel={handleScrollAnio}>
                    <label htmlFor="anio">Año:</label>
                    <div className="year-picker">
                        <input
                            type="text"
                            id="anio"
                            value={anio}
                            onChange={handleChangeAnio}
                            maxLength={4}
                            className="year-input"
                        />
                        <div className="year-controls">
                            <button onClick={handleIncrementAnio} className="year-btn up">▲</button>
                            <button onClick={handleDecrementAnio} className="year-btn down">▼</button>
                        </div>
                    </div>
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
                                    {mesesAbreviados[mes.mes - 1]}
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
