import React, { useState } from 'react';
import ConsumoForm from '../components/ConsumoForm';
import ConsumoHistorial from '../components/ConsumoHistorial';

const Consumo = () => {
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(null);
    const [consumoActualizado, setConsumoActualizado] = useState(false);

    // Esta función se llamará cuando se seleccione un cliente en el formulario
    const handleClienteSeleccionado = (idCliente) => {
        setIdClienteSeleccionado(idCliente);  // Actualiza el cliente seleccionado
    };

    // Esta función se llamará cuando un consumo sea registrado
    const handleConsumoRegistrado = () => {
        setConsumoActualizado(!consumoActualizado);  // Actualiza el historial de consumos
    };

    return (
        <div className="content-wrapper">
            <section className="content">
                <div className="container-fluid">
                    <h1>Registro de Consumo de Agua</h1>

                    {/* Formulario para registrar consumo */}
                    <ConsumoForm
                        onConsumoRegistrado={handleConsumoRegistrado}
                        onClienteSeleccionado={handleClienteSeleccionado}  // Pasamos la función de selección de cliente
                    />

                    {/* Mostramos el historial de consumo si hay un cliente seleccionado */}
                    {idClienteSeleccionado && (
                        <ConsumoHistorial
                            idCliente={idClienteSeleccionado}
                            onConsumoActualizado={consumoActualizado}
                        />
                    )}
                </div>
            </section>
        </div>
    );
};

export default Consumo;