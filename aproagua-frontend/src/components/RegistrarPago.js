import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';  // Para recibir el estado
import config from '../../config';

const RegistrarPago = ({ onPagoRegistrado }) => {
    const [facturasPendientes, setFacturasPendientes] = useState([]);
    const [idFactura, setIdFactura] = useState('');
    const [fechaPago, setFechaPago] = useState('');
    const [montoPagado, setMontoPagado] = useState('');
    const location = useLocation();  // Hook para acceder al state

    // Obtener el ID de la factura de la navegación, si existe
    useEffect(() => {
        if (location.state && location.state.idFactura) {
            setIdFactura(location.state.idFactura);
        }
    }, [location.state]);

    // Obtener facturas pendientes al cargar el componente
    useEffect(() => {
        const obtenerFacturasPendientes = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/api/facturas/pendientes`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setFacturasPendientes(res.data);
            } catch (err) {
                console.error('Error al obtener facturas pendientes', err);
            }
        };
        obtenerFacturasPendientes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idFactura || !fechaPago || !montoPagado) {
            alert('Todos los campos son obligatorios');
            return;
        }

        try {
            const res = await axios.post(`${config.API_BASE_URL}/api/pagos`, {
                id_factura: idFactura,
                fecha_pago: fechaPago,
                monto_pagado: parseFloat(montoPagado),
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            alert('Pago registrado correctamente');
            setIdFactura('');
            setFechaPago('');
            setMontoPagado('');
            if (onPagoRegistrado) onPagoRegistrado();  // Refresca el historial de pagos
        } catch (err) {
            console.error('Error al registrar pago', err);
            alert('Error al registrar pago');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Registrar Pago</h3>
            <div className="form-group">
                <label>Factura Pendiente</label>
                <select
                    className="form-control"
                    value={idFactura}
                    onChange={(e) => setIdFactura(e.target.value)}
                    required
                >
                    <option value="">Seleccionar factura</option>
                    {facturasPendientes.map(factura => (
                        <option key={factura.ID_Factura} value={factura.ID_Factura}>
                            {factura.Nombre} {factura.Apellido} - {factura.Monto} 
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Fecha de Pago</label>
                <input
                    type="date"
                    className="form-control"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label>Monto Pagado</label>
                <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={montoPagado}
                    onChange={(e) => setMontoPagado(e.target.value)}
                    required
                />
            </div>

            <button type="submit" className="btn btn-primary">Registrar Pago</button>
        </form>
    );
};

export default RegistrarPago;
