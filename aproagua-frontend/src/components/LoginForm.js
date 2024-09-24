import React from 'react';
import './LoginForm.css';  // Asegúrate de que los estilos para el modal estén configurados correctamente

const LoginForm = ({ onClose }) => {
    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <h2>Bienvenido</h2>
                <form>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input type="text" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input type="password" className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary">Ingresar</button>
                </form>
                <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default LoginForm;
