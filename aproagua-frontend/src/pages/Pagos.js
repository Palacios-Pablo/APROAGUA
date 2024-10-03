import React, { useState } from 'react';
import RegistrarPago from '../components/RegistrarPago';
import HistorialPagos from '../components/HistorialPagos';

const Pagos = () => {
    const [pagoRegistrado, setPagoRegistrado] = useState(false);

    const handlePagoRegistrado = () => {
        setPagoRegistrado(!pagoRegistrado);  // Cambia el estado para refrescar el historial de pagos
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Pagos</h1>
                    
                    {/* Formulario para registrar un nuevo pago */}
                    <RegistrarPago onPagoRegistrado={handlePagoRegistrado} />

                    {/* Historial de pagos */}
                    <HistorialPagos key={pagoRegistrado} />
                </div>
            </section>
        </div>
    );
};

export default Pagos;
