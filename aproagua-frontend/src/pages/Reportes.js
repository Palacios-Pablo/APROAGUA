import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  // Importar FontAwesomeIcon
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';  // Íconos de Excel y PDF
import './Reportes.css';  // Asegúrate de enlazar el archivo CSS


const Reportes = () => {
    const [tipoReporte, setTipoReporte] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [reporteDatos, setReporteDatos] = useState([]);

    const handleGenerarReporte = async () => {
        if (!tipoReporte || !fechaInicio || !fechaFin) {
            alert('Debes seleccionar el tipo de reporte y el rango de fechas');
            return;
        }

        try {
            const res = await axios.get(`http://localhost:3000/api/reportes/${tipoReporte}`, {
                params: { fechaInicio, fechaFin },
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setReporteDatos(res.data);
        } catch (err) {
            console.error('Error al generar el reporte', err);
            alert('Error al generar el reporte');
        }
    };

    const handleDescargarExcel = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/reportes/descargar/excel`, {
                params: { tipo: tipoReporte, fechaInicio, fechaFin },
                headers: { 'x-auth-token': localStorage.getItem('token') },
                responseType: 'blob'  // Necesario para manejar descargas de archivos
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Error al descargar el reporte en Excel', err);
        }
    };

    const handleDescargarPDF = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/api/reportes/descargar/pdf`, {
                params: { tipo: tipoReporte, fechaInicio, fechaFin },
                headers: { 'x-auth-token': localStorage.getItem('token') },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error('Error al descargar el reporte en PDF', err);
        }
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Generar Reportes</h1>

                    {/* Selección del tipo de reporte */}
                    <div className="form-group">
                        <label>Tipo de Reporte</label>
                        <select className="form-control" value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
                            <option value="">Selecciona el tipo de reporte</option>
                            <option value="ingresos">Reporte de Ingresos</option>
                            <option value="consumo">Reporte de Consumo</option>
                            <option value="facturacion">Reporte de Facturación</option>
                        </select>
                    </div>

                    {/* Selección de rango de fechas */}
                    <div className="form-group">
                        <label>Fecha de Inicio</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha de Fin</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            required
                        />
                    </div>

                    {/* Botón para generar el reporte */}
                    <button className="btn btn-primary mb-3" onClick={handleGenerarReporte}>
                        Generar Reporte
                    </button>
                    {/* Opciones para descargar el reporte */}
                    {reporteDatos.length > 0 && (
                        <div>
                            <button className="btn btn-excel" onClick={handleDescargarExcel}>
                                <FontAwesomeIcon icon={faFileExcel} className="icon" /> Descargar en Excel
                            </button>
                            <button className="btn btn-pdf" onClick={handleDescargarPDF}>
                                <FontAwesomeIcon icon={faFilePdf} className="icon" /> Descargar en PDF
                            </button>
                        </div>
                    )}

                    {/* Mostrar los resultados del reporte */}
                    {reporteDatos.length > 0 && (
                        <div className="table-responsive mt-4">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        {Object.keys(reporteDatos[0]).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteDatos.map((dato, index) => (
                                        <tr key={index}>
                                            {Object.values(dato).map((value, idx) => (
                                                <td key={idx}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reportes;
