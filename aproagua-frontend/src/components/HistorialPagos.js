import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import config from '../config';
const HistorialPagos = () => {
    const [pagos, setPagos] = useState([]);

    // Obtener el historial de pagos al cargar el componente
    useEffect(() => {
        const obtenerPagos = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/api/pagos`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setPagos(res.data);
            } catch (err) {
                console.error('Error al obtener pagos', err);
            }
        };
        obtenerPagos();
    }, []);

    // Anular o revertir un pago
    const handleRevertirPago = async (idPago) => {
        if (window.confirm('¿Estás seguro de que deseas anular este pago?')) {
            try {
                await axios.delete(`${config.API_BASE_URL}/api/pagos/${idPago}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setPagos(pagos.filter(pago => pago.ID_Pago !== idPago));
                alert('Pago anulado correctamente');
            } catch (err) {
                console.error('Error al anular el pago', err);
                alert('Error al anular el pago');
            }
        }
    };

    return (
        <div className="table-responsive">
            <h3>Historial de Pagos</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                       
                        <th>Cliente</th>
                        <th>Fecha de Pago</th>
                        <th>Monto Pagado</th>
                        <th>Factura</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map(pago => (
                        <tr key={pago.ID_Pago}>
                            
                            <td>{pago.Nombre} {pago.Apellido}</td>
                            <td>{pago.Fecha_Pago}</td>
                            <td>Q. {pago.Monto_Pagado} </td>
                            <td>Factura #{pago.ID_Factura}</td>
                            <td>
                                <button 
                                                className="btn btn-danger"
                                                onClick={() => handleRevertirPago(pago.ID_Pago)}
                                            >
                                                <FontAwesomeIcon icon={faTrashAlt} size="lg" /> {/* Icono de eliminar */}
                               </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialPagos;
