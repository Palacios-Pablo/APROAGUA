// src/components/AsignarTarifaModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const AsignarTarifaModal = ({ isOpen, onClose, cliente }) => {
    const [tarifas, setTarifas] = useState([]);
    const [tarifaSeleccionada, setTarifaSeleccionada] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    useEffect(() => {
        const cargarTarifas = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/tarifas', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setTarifas(res.data);
            } catch (err) {
                console.error('Error al obtener tarifas', err);
            }
        };

        cargarTarifas();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`http://localhost:3000/api/clientes/asignar-tarifa`, {
                id_cliente: cliente.ID_Cliente,
                id_tarifa: tarifaSeleccionada,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin || null
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });

            onClose();
        } catch (err) {
            console.error('Error al asignar tarifa', err);
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Asignar Tarifa Modal">
            <h2>Asignar Tarifa</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tarifa</label>
                    <select className="form-control" value={tarifaSeleccionada} onChange={(e) => setTarifaSeleccionada(e.target.value)} required>
                        <option value="">Selecciona una Tarifa</option>
                        {tarifas.map((tarifa) => (
                            <option key={tarifa.ID_Tarifa} value={tarifa.ID_Tarifa}>
                                {tarifa.Descripcion} - Q.{tarifa.Precio_Por_Litro}/Mes
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Fecha de Inicio</label>
                    <input type="date" className="form-control" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Fecha de Fin (opcional)</label>
                    <input type="date" className="form-control" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                </div>
                <div className="modal-buttons">
                    <button type="submit" className="modal-btn-primary">Asignar Tarifa</button>
                    <button type="button" className="modal-btn-secondary" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </Modal>
    );
};

export default AsignarTarifaModal;
