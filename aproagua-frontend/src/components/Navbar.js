import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Asegúrate de que esta ruta sea correcta
import LoginForm from './LoginForm';  // Importamos el formulario de login

const Navbar = () => {
    const [showLogin, setShowLogin] = useState(false);  // Estado para controlar si el modal de login está visible

    const handleLoginClick = () => {
        setShowLogin(true);  // Mostrar el modal de login cuando se hace clic en "Ingresar"
    };

    const handleCloseLogin = () => {
        setShowLogin(false);  // Cerrar el modal de login
    };

    return (
        <div className="navbar-wrapper">
            <nav className="navbar">
                <Link className="navbar-brand" to="/">APROAGUA</Link>

                <div className="navbar-links">
                    <Link className="nav-link" to="/">Inicio</Link>
                    <Link className="nav-link" to="/servicios">Servicios</Link>
                    <Link className="nav-link" to="/contacto">Contacto</Link>
                    <Link className="nav-link" to="/quienes-somos">Quiénes Somos</Link>
                </div>

                {/* Cambiamos el botón "Ingresar" para que muestre el formulario de login */}
                <button className="btn" onClick={handleLoginClick}>
                    Ingresar
                </button>
            </nav>

            {/* Mostrar el formulario de login si showLogin es true */}
            {showLogin && <LoginForm onClose={handleCloseLogin} />}
        </div>
    );
};

export default Navbar;
