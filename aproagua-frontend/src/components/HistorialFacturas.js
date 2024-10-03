import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistorialFacturas = () => {
    const [facturas, setFacturas] = useState([]);

    // Obtener todas las facturas al cargar el componente
    useEffect(() => {
        const obtenerFacturas = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/facturas', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setFacturas(res.data);
            } catch (err) {
                console.error('Error al obtener facturas', err);
            }
        };
        obtenerFacturas();
    }, []);

    // Marcar una factura como pagada
    const handleMarcarComoPagada = async (idFactura) => {
        if (window.confirm('¿Estás seguro de marcar esta factura como pagada?')) {
            try {
                await axios.put(`http://localhost:3000/api/facturas/${idFactura}/pagada`, {}, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setFacturas(facturas.map(factura => 
                    factura.ID_Factura === idFactura ? { ...factura, Estado: 'pagado' } : factura
                ));
                alert('Factura marcada como pagada');
            } catch (err) {
                console.error('Error al marcar factura como pagada', err);
            }
        }
    };

    // Descargar factura en PDF
    const handleDescargarPDF = async (idFactura) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/facturas/${idFactura}/pdf`, {
                headers: { 'x-auth-token': localStorage.getItem('token') },
                responseType: 'blob'  // Importante para descargar archivos
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `factura_${idFactura}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Error al descargar factura PDF', err);
        }
    };

    return (
        <div className="table-responsive">
            <h3>Historial de Facturas</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha de Emisión</th>
                        <th>Monto</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facturas.map(factura => (
                        <tr key={factura.ID_Factura}>
                            <td>{factura.ID_Factura}</td>
                            <td>{factura.Nombre} {factura.Apellido}</td>
                            <td>{factura.Fecha_Emision}</td>
                            <td>{factura.Monto} USD</td>
                            <td>{factura.Estado}</td>
                            <td>
                                {factura.Estado === 'pendiente' && (
                                    <button className="btn btn-success" onClick={() => handleMarcarComoPagada(factura.ID_Factura)}>
                                        Marcar como Pagada
                                    </button>
                                )}
                                <button className="btn btn-info ml-2" onClick={() => handleDescargarPDF(factura.ID_Factura)}>
                                    Descargar PDF
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialFacturas;
