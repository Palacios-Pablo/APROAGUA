import React from 'react';
import { Navigate } from 'react-router-dom';

// Componente para proteger las rutas
const RutaProtegida = ({ children }) => {
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    if (!token) {
        // Si no hay token, redirigir al login
        return <Navigate to="/login" />;
    }

    // Si hay token, permitir el acceso a la ruta
    return children;
};

export default RutaProtegida;
