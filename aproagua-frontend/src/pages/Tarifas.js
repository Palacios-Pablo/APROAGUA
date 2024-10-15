import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Tarifas = () => {
    const [tarifas, setTarifas] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [tarifaEditada, setTarifaEditada] = useState(null);  // Para editar una tarifa
    const [descripcion, setDescripcion] = useState('');
    const [precioPorLitro, setPrecioPorLitro] = useState('');

    // Cargar las tarifas desde el backend al cargar la página
    useEffect(() => {
        cargarTarifas();
    }, []);

    const cargarTarifas = async () => {
        try {
            // Incluir el token JWT en el encabezado
            const res = await axios.get('http://localhost:3000/api/tarifas', {
                headers: { 'x-auth-token': localStorage.getItem('token') }  // Enviar el token JWT
            });
            setTarifas(res.data);
        } catch (error) {
            console.error('Error al cargar tarifas:', error);
        }
    };

    const abrirModal = (tarifa = null) => {
        if (tarifa) {
            setTarifaEditada(tarifa);  // Si está editando, se cargan los datos de la tarifa
            setDescripcion(tarifa.Descripcion);
            setPrecioPorLitro(tarifa.Precio_Por_Litro);
        } else {
            setTarifaEditada(null);  // Limpiar el formulario si es una nueva tarifa
            setDescripcion('');
            setPrecioPorLitro('');
        }
        setModalIsOpen(true);
    };

    const cerrarModal = () => {
        setModalIsOpen(false);
    };

    const handleGuardarTarifa = async () => {
        try {
            const headers = { 'x-auth-token': localStorage.getItem('token') };  // Encabezado con el token

            if (tarifaEditada) {
                // Editar una tarifa existente
                await axios.put(`http://localhost:3000/api/tarifas/${tarifaEditada.ID_Tarifa}`, {
                    descripcion,
                    precio_por_litro: precioPorLitro
                }, { headers });
            } else {
                // Crear una nueva tarifa
                await axios.post('http://localhost:3000/api/tarifas', {
                    descripcion,
                    precio_por_litro: precioPorLitro
                }, { headers });
            }
            cerrarModal();
            cargarTarifas();  // Recargar las tarifas después de la operación
        } catch (error) {
            console.error('Error al guardar tarifa:', error);
        }
    };

    const handleEliminarTarifa = async (id_tarifa) => {
        try {
            // Eliminar tarifa con el token en el encabezado
            await axios.delete(`http://localhost:3000/api/tarifas/${id_tarifa}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            cargarTarifas();  // Recargar las tarifas después de eliminar
        } catch (error) {
            console.error('Error al eliminar tarifa:', error);
        }
    };

    return (
        <div className="container">
            <h2>Gestión de Tarifas</h2>
            <button onClick={() => abrirModal()} className="btn btn-primary mb-3">
                Crear Nueva Tarifa
            </button>

            <table className="table table-bordered">
                <thead>
                    <tr>
                    
                        <th>Descripción</th>
                        <th>Precio por Litro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {tarifas.map((tarifa) => (
                        <tr key={tarifa.ID_Tarifa}>
                           
                            <td>{tarifa.Descripcion}</td>
                            <td>{tarifa.Precio_Por_Litro}</td>
                            <td>
                                <button onClick={() => abrirModal(tarifa)} className="btn btn-warning">
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleEliminarTarifa(tarifa.ID_Tarifa)}
                                    className="btn btn-danger ml-2"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal para crear/editar tarifas */}
            <Modal isOpen={modalIsOpen} onRequestClose={cerrarModal}>
                <h2>{tarifaEditada ? 'Editar Tarifa' : 'Crear Nueva Tarifa'}</h2>
                <form>
                    <div className="form-group">
                        <label>Descripción:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio por Litro:</label>
                        <input
                            type="number"
                            className="form-control"
                            value={precioPorLitro}
                            onChange={(e) => setPrecioPorLitro(e.target.value)}
                        />
                    </div>
                    <button type="button" onClick={handleGuardarTarifa} className="btn btn-success">
                        Guardar
                    </button>
                    <button type="button" onClick={cerrarModal} className="btn btn-secondary ml-2">
                        Cancelar
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Tarifas;
