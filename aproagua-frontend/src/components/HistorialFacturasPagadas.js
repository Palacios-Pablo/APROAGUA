import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';

const HistorialFacturasPagadas = () => {
    const [facturas, setFacturas] = useState([]);
    const [busqueda, setBusqueda] = useState(''); // Estado para el filtro de búsqueda

    // Obtener todas las facturas pagadas al cargar el componente
    useEffect(() => {
        const obtenerFacturasPagadas = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/facturas/pagadas', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setFacturas(res.data);
            } catch (err) {
                console.error('Error al obtener facturas pagadas', err);
            }
        };
        obtenerFacturasPagadas();
    }, []);

    // Función para descargar la factura en PDF
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

    // Filtrar las facturas por el nombre del cliente
    const facturasFiltradas = facturas.filter(factura => 
        factura.Nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        factura.Apellido.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="table-responsive">
            <h3>Facturas Pagadas</h3>

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
                                <button className="btn btn-pdf1" onClick={() => handleDescargarPDF(factura.ID_Factura)}>
                                <FontAwesomeIcon icon={faFilePdf} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistorialFacturasPagadas;
