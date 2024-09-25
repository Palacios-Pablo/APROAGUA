const bcrypt = require('bcryptjs');

// La contraseña que deseas encriptar
const plainPassword = 'mcJoseP123.';

// Generar el hash de la contraseña
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log('Contraseña Hasheada:', hash);
});
