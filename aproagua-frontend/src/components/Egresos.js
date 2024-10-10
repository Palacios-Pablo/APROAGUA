import React, { useState, useEffect } from 'react';
import EgresoModal from './EgresoModal'; // Modal para agregar/editar egresos
import axios from 'axios';  // Para hacer peticiones al backend
import './Egresos.css'; // Estilos personalizados

const Egresos = () => {
    const [egresos, setEgresos] = useState([]); // Lista de egresos
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para abrir/cerrar el modal
    const [egresoSeleccionado, setEgresoSeleccionado] = useState(null); // Egreso seleccionado (para editar)

    const [busqueda, setBusqueda] = useState("");  // Estado para el filtro de búsqueda
    const [paginaActual, setPaginaActual] = useState(1); // Paginación
    const [egresosPorPagina] = useState(4); // Mostrar 4 filas por página

    // Obtener egresos al cargar el componente
    useEffect(() => {
        const obtenerEgresos = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/egresos', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setEgresos(res.data);
            } catch (err) {
                console.error('Error al obtener egresos', err);
            }
        };
        obtenerEgresos();
    }, []);

    // Función para abrir el modal en modo agregar
    const handleAgregarEgreso = () => {
        setEgresoSeleccionado(null); // No hay egreso seleccionado
        setIsModalOpen(true); // Abrir el modal
    };

    // Función para abrir el modal en modo editar
    const handleEditarEgreso = (egreso) => {
        setEgresoSeleccionado(egreso); // Establecer el egreso seleccionado
        setIsModalOpen(true); // Abrir el modal
    };

    // Función para eliminar un egreso
    const handleEliminarEgreso = async (id_egreso) => {
        if (window.confirm('¿Estás seguro de eliminar este egreso?')) {
            try {
                // Eliminar el egreso en el backend
                const res = await axios.delete(`http://localhost:3000/api/egresos/${id_egreso}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                
                // Si la eliminación fue exitosa en el backend
                if (res.status === 200) {
                    // Actualizar la lista de egresos en el frontend
                    setEgresos(egresos.filter(egreso => egreso.ID_Egreso !== id_egreso));
                }
            } catch (err) {
                console.error('Error al eliminar egreso', err.response || err);
            }
        }
    };

        // Función para actualizar la lista de egresos
        const actualizarEgresos = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/egresos', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setEgresos(res.data);  // Actualiza la lista de egresos
            } catch (err) {
                console.error('Error al obtener egresos', err);
            }
        };
    
        useEffect(() => {
            actualizarEgresos();  // Cargar los egresos cuando el componente se monte
        }, []);


    // Filtrar egresos por búsqueda
    const egresosFiltrados = egresos.filter((egreso) =>
        egreso.Descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Obtener egresos para la página actual
    const indexUltimoEgreso = paginaActual * egresosPorPagina;
    const indexPrimerEgreso = indexUltimoEgreso - egresosPorPagina;
    const egresosPaginados = egresosFiltrados.slice(indexPrimerEgreso, indexUltimoEgreso);

    // Cambiar de página
    const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Egresos</h1>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar por descripción..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="form-control mb-3"
                    />

                    <button className="btn btn-primary mb-3" onClick={handleAgregarEgreso}>
                        Agregar Egreso
                    </button>

                    {/* Tabla de Egresos */}
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {egresosPaginados.map((egreso) => (
                                    <tr key={egreso.ID_Egreso}>
                                        <td>{egreso.ID_Egreso}</td>
                                        <td>{egreso.Fecha}</td>
                                        <td>{egreso.Descripcion}</td>
                                        <td>{egreso.Monto} USD</td>
                                        <td>
                                            <button
                                                className="btn btn-warning"
                                                onClick={() => handleEditarEgreso(egreso)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleEliminarEgreso(egreso.ID_Egreso)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    <nav>
                        <ul className="pagination">
                            {Array.from({ length: Math.ceil(egresosFiltrados.length / egresosPorPagina) }).map((_, index) => (
                                <li key={index} className="page-item">
                                    <button className="page-link" onClick={() => cambiarPagina(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Modal para agregar/editar egresos */}
                    <EgresoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        egresoSeleccionado={egresoSeleccionado}
                        actualizarEgresos={actualizarEgresos} // Pasamos esta función
                    />
                </div>
            </section>
        </div>
    );
};

export default Egresos;
