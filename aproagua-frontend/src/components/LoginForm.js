import React, { useState } from 'react';
import axios from 'axios';  // Importamos axios para hacer la solicitud al backend
import './LoginForm.css';  // Asegúrate de que los estilos para el modal estén configurados correctamente
import config from '../../config';
const LoginForm = ({ onClose }) => {
    const [username, setUsername] = useState('');  // Estado para almacenar el usuario
    const [password, setPassword] = useState('');  // Estado para almacenar la contraseña
    const [error, setError] = useState('');  // Estado para manejar errores

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();  // Evitar que el formulario recargue la página

        try {
            const res = await axios.post(`${config.API_BASE_URL}/api/auth/login`, {
                nombre_usuario: username,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'  // Asegurarse de enviar el cuerpo como JSON
                }
            });
    
            const { token } = res.data;
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Error en el inicio de sesión:', err);
            setError('Credenciales incorrectas o error en el servidor');
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                {/* Agregar la "X" roja para cerrar el modal */}
                <span className="close-modal" onClick={onClose}>&times;</span>
                <h2>Bienvenido</h2>

                {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Mostrar mensaje de error si existe */}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Usuario:</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}  // Actualizar el estado con el valor ingresado
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}  // Actualizar el estado con el valor ingresado
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Ingresar</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
