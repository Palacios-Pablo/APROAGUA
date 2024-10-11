import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir

const HistorialFacturasPendientes = () => {
    const [facturas, setFacturas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); // Estado para el filtro de búsqueda
    const navigate = useNavigate();  // Hook para navegación

    // Obtener todas las facturas pendientes al cargar el componente
    useEffect(() => {
        const obtenerFacturasPendientes = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/facturas/pendientes', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setFacturas(res.data);
            } catch (err) {
                console.error('Error al obtener facturas pendientes', err);
            }
        };
        obtenerFacturasPendientes();
    }, []);

    // Redirigir a la página de pagos con la factura seleccionada
    const handlePagarFactura = (idFactura) => {
        // Redirigimos a la página de pagos con el ID de la factura
        navigate(`/pagos`, { state: { idFactura } });
    };

    // Filtrar las facturas por el nombre del cliente
    const facturasFiltradas = facturas.filter(factura => 
        factura.Nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        factura.Apellido.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="table-responsive">
            <h3>Facturas Pendientes</h3>

            {/* Buscador */}
            <input
                type="text"
                placeholder="Buscar por cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="form-control mb-3"
            />

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha de Emisión</th>
                        <th>Monto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facturasFiltradas.map(factura => (
                        <tr key={factura.ID_Factura}>
                            <td>{factura.ID_Factura}</td>
                            <td>{factura.Nombre} {factura.Apellido}</td>
                            <td>{factura.Fecha_Emision}</td>
                            <td>Q. {factura.Monto}</td>
                            <td>
                                {/* Botón de pagar factura */}
                                <button className="btn btn-primary" onClick={() => handlePagarFactura(factura.ID_Factura)}>
                                    Pagar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialFacturasPendientes;
