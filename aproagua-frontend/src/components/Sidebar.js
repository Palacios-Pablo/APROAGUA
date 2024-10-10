import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';  // Asegúrate de importar el archivo de estilos

const Sidebar = () => {
    const navigate = useNavigate(); // Hook para la navegación

    const handleLogout = () => {
        navigate('/');  // Redirigir a la página de inicio
    };

    return (
        <aside className="sidebar">
            <nav>
                <ul>
                    <li>
                        <Link to="/dashboard">
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/clientes">
                            <i className="fas fa-users"></i> Gestión de Clientes
                        </Link>
                    </li>
                    <li>
                        <Link to="/facturacion">
                            <i className="fas fa-file-invoice"></i> Facturación
                        </Link>
                    </li>
                    <li>
                        <Link to="/pagos">
                            <i className="fas fa-credit-card"></i> Pagos
                        </Link>
                    </li>
                    <li>
                        <Link to="/egresos">
                            <i className="fas fa-money-bill-wave"></i> Egresos
                        </Link>
                    </li>
                    <li>
                        <Link to="/reportes">
                            <i className="fas fa-chart-line"></i> Reportes
                        </Link>
                    </li>
                    <li>
                        <Link to="/finanzas">
                            <i className="fas fa-balance-scale"></i> Dashboard Financiero
                        </Link>
                    </li>

                </ul>
            </nav>
            <button className="logout-button" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Salir
            </button>
        </aside>
    );
};

export default Sidebar;
