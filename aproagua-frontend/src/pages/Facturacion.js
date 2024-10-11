import React from 'react';
import HistorialFacturasPendientes from '../components/HistorialFacturasPendientes';
import HistorialFacturasPagadas from '../components/HistorialFacturasPagadas';

const Facturacion = () => {
    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Gestión de Facturación</h1>

                    {/* Tabla de facturas pendientes */}
                    <HistorialFacturasPendientes />

                    {/* Tabla de facturas pagadas */}
                    <HistorialFacturasPagadas />
                </div>
            </section>
        </div>
    );
};

export default Facturacion;
