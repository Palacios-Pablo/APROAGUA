import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';  // Para redirigir y obtener cliente seleccionado
import ConsumoForm from '../components/ConsumoForm';
import ConsumoHistorial from '../components/ConsumoHistorial';
import './Consumo.css';

const Consumo = () => {
    const navigate = useNavigate();  // Hook para la navegación
    const location = useLocation();  // Obtener el cliente de la redirección
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState(location.state?.cliente?.ID_Cliente || null);
    const [consumoActualizado, setConsumoActualizado] = useState(false);

    // Función para volver a la página de clientes
    const handleCerrar = () => {
        navigate('/clientes');  // Redirigir de vuelta a la página de clientes
    };

    const handleClienteSeleccionado = (idCliente) => {
        setIdClienteSeleccionado(idCliente);
    };

    const handleConsumoRegistrado = () => {
        setConsumoActualizado(!consumoActualizado);
    };

    return (
        <div className="content-wrapper" style={{ position: 'relative' }}>  {/* Agregar position relative al contenedor */}
            <section className="content">
                <div className="container-fluid">
                    {/* Botón de cierre para regresar a la página de clientes */}
                    <button onClick={handleCerrar} className="close-button">
                        &times; {/* Usar el símbolo × para el cierre */}
                    </button>

                    <h1>Registro de Consumo de Agua</h1>

                    {/* Pasar el cliente preseleccionado al formulario */}
                    <ConsumoForm
                        onConsumoRegistrado={handleConsumoRegistrado}
                        onClienteSeleccionado={handleClienteSeleccionado}
                        clienteSeleccionado={location.state?.cliente}  // Pasar cliente preseleccionado
                    />

                    {/* Mostrar el historial de consumo si hay un cliente seleccionado */}
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
