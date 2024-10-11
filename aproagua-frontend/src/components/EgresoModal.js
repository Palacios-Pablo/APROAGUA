import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EgresoModal = ({ isOpen, onClose, egresoSeleccionado, actualizarEgresos }) => {
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [monto, setMonto] = useState('');
    
    
    // Si hay un egreso seleccionado, precargar los datos en el modal
    useEffect(() => {
        if (egresoSeleccionado) {
            setFecha(egresoSeleccionado.Fecha);
            setDescripcion(egresoSeleccionado.Descripcion);
            setMonto(egresoSeleccionado.Monto);
        } else {
            setFecha('');
            setDescripcion('');
            setMonto('');
        }
    }, [egresoSeleccionado]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const id_balance = 1;  // ID de balance fijo para todos los egresos (balance general)
    
        try {
            if (egresoSeleccionado) {
                // Editar egreso
                const res = await axios.put(`http://localhost:3000/api/egresos/${egresoSeleccionado.ID_Egreso}`, {
                    fecha, descripcion, monto, id_balance  // Mandamos el ID_Balance junto con los demás datos
                }, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
    
                if (res.status === 200) {
                    actualizarEgresos();  // Actualizamos la lista de egresos en el frontend
                }
            } else {
                // Crear nuevo egreso
                const res = await axios.post('http://localhost:3000/api/egresos', {
                    fecha, descripcion, monto, id_balance  // Mandamos el ID_Balance junto con los demás datos
                }, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
    
                if (res.status === 200) {
                    actualizarEgresos();  // Actualizamos la lista de egresos en el frontend
                }
            }
    
            onClose();  // Cerramos el modal después de guardar los cambios
        } catch (err) {
            console.error('Error al guardar el egreso', err);
        }
    };
    
  
    if (!isOpen) return null; // No mostrar el modal si no está abierto

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>{egresoSeleccionado ? 'Editar Egreso' : 'Agregar Egreso'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Monto (Quetzales)</label>
                        <input
                            type="number"
                            className="form-control"
                            value={monto}
                            onChange={(e) => setMonto(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                            {egresoSeleccionado ? 'Guardar Cambios' : 'Agregar Egreso'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EgresoModal;
