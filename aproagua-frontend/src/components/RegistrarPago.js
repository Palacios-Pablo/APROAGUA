import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistrarPago = ({ onPagoRegistrado }) => {
    const [facturasPendientes, setFacturasPendientes] = useState([]);
    const [idFactura, setIdFactura] = useState('');
    const [fechaPago, setFechaPago] = useState('');
    const [montoPagado, setMontoPagado] = useState('');

    // Obtener facturas pendientes al cargar el componente
    useEffect(() => {
        const obtenerFacturasPendientes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/facturas', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                // Filtrar solo facturas pendientes
                const pendientes = res.data.filter(factura => factura.Estado === 'pendiente');
                setFacturasPendientes(pendientes);
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
            const res = await axios.post('http://localhost:3000/api/pagos', {
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
                            {factura.Nombre} {factura.Apellido} - {factura.Monto} USD
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
