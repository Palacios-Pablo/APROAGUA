import React from 'react';
import axios from 'axios';

const GenerarFacturas = ({ onFacturasGeneradas }) => {
    const handleGenerarFacturas = async () => {
        if (window.confirm('¿Estás seguro de que deseas generar las facturas mensuales?')) {
            try {
                const res = await axios.post('http://localhost:3000/api/facturas/generar', {}, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                alert('Facturas generadas correctamente');
                if (onFacturasGeneradas) onFacturasGeneradas();  // Actualiza el historial
            } catch (err) {
                console.error('Error al generar facturas', err);
                alert('Error al generar facturas');
            }
        }
    };

    return (
        <button className="btn btn-primary mb-3" onClick={handleGenerarFacturas}>
            Generar Facturas Mensuales
        </button>
    );
};

export default GenerarFacturas;
