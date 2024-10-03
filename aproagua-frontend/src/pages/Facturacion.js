import React, { useState } from 'react';
import GenerarFacturas from '../components/GenerarFacturas';
import HistorialFacturas from '../components/HistorialFacturas';

const Facturacion = () => {
    const [facturasGeneradas, setFacturasGeneradas] = useState(false);

    // Se llamará cuando se generen las facturas para actualizar el historial
    const handleFacturasGeneradas = () => {
        setFacturasGeneradas(!facturasGeneradas);  // Cambiamos el estado para refrescar el historial
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Facturación</h1>
                    
                    {/* Botón para generar facturas */}
                    <GenerarFacturas onFacturasGeneradas={handleFacturasGeneradas} />

                    {/* Historial de facturas */}
                    <HistorialFacturas key={facturasGeneradas} />
                </div>
            </section>
        </div>
    );
};

export default Facturacion;
