const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/dbconfig');  // Importamos la conexión a la base de datos

// Controlador para el login de usuarios administrativos
// Controlador para el login de usuarios administrativos
exports.login = async (req, res) => {
    const { nombre_usuario, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const [rows] = await pool.execute('SELECT * FROM Usuario_Administrativo WHERE Nombre_Usuario = ?', [nombre_usuario]);

        if (rows.length === 0) {
            return res.status(400).json({ msg: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Verificar la contraseña con bcrypt
        const isMatch = await bcrypt.compare(password, user.Password_Hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // Verifica que JWT_SECRET esté definido
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ msg: 'Error del servidor: JWT_SECRET no está definido' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.ID_Usuario, rol: user.Rol }, process.env.JWT_SECRET, {
            expiresIn: '1h',  // Expira en 1 hora
        });

        res.json({ token });
    } catch (err) {
        console.error('Error al iniciar sesión', err);  // Mostrar el error en la consola
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

// Controlador para registrar un nuevo usuario administrativo
exports.register = async (req, res) => {
    const { nombre, apellido, nombre_usuario, password, rol } = req.body;

    try {
        // Verificar si el nombre de usuario ya existe
        const [existingUser] = await pool.execute('SELECT * FROM Usuario_Administrativo WHERE Nombre_Usuario = ?', [nombre_usuario]);
        if (existingUser.length > 0) {
            return res.status(400).json({ msg: 'El nombre de usuario ya existe' });
        }

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Insertar el nuevo usuario en la base de datos
        await pool.execute(
            'INSERT INTO Usuario_Administrativo (Nombre, Apellido, Nombre_Usuario, Password_Hash, Rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, apellido, nombre_usuario, passwordHash, rol]
        );

        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error('Error al registrar el usuario:', err);  // Mostrar el error en la consola
        res.status(500).json({ msg: 'Error del servidor', error: err.message });  // Enviar detalles del error
    }
};
