const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');  // Importa las rutas de autenticación
const authMiddleware = require('./middlewares/authMiddleware');  // Importa el middleware de autenticación

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

const app = express();
app.use(express.json());  // Middleware para parsear JSON en el cuerpo de las solicitudes

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta protegida de ejemplo (solo accesible con un token válido)
app.get('/api/protegida', authMiddleware, (req, res) => {
    res.json({ msg: `Acceso permitido. Usuario: ${req.user.id}, Rol: ${req.user.rol}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
