import React from 'react';
import Clientes from '../components/Clientes';  // Importamos el componente Clientes

const ClientesPage = () => {
    return (
        <div className="clientes-page">
            {/* Aquí puedes agregar alguna barra de navegación o encabezado si lo necesitas */}
            <Clientes />
        </div>
    );
}

export default ClientesPage;
