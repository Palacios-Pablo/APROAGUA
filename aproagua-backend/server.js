const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');  // Ya has importado cors
const tarifaRoutes = require('./routes/tarifaRoutes'); 
const clienteRoutes = require('./routes/clienteRoutes');
const consumoRoutes = require('./routes/consumoRoutes');
const facturaRoutes = require('./routes/facturaRoutes');
const pagoRoutes = require('./routes/pagoRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const finanzasRoutes = require('./routes/finanzasRoutes');  
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');

dotenv.config();  // Cargar las variables de entorno desde el archivo .env

const app = express();

// Habilitar CORS para solicitudes desde http://localhost:3001
app.use(cors({ origin: 'http://localhost:3001' }));

// Habilitar middleware para parsear JSON
app.use(express.json());

// Definir rutas
app.use('/api/clientes', clienteRoutes);
app.use('/api/consumos', consumoRoutes);
app.use('/api/facturas', facturaRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/finanzas', finanzasRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/tarifas', tarifaRoutes); 

// Ruta protegida de ejemplo
app.get('/api/protegida', authMiddleware, (req, res) => {
    res.json({ msg: `Acceso permitido. Usuario: ${req.user.id}, Rol: ${req.user.rol}` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
