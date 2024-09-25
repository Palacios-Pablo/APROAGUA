const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
    // Obtener el token del header
    const token = req.header('x-auth-token');
    
    // Verificar si el token existe
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    try {
        // Verificar el token y extraer el usuario
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();  // Pasar al siguiente middleware o controlador
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;
