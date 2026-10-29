const bcrypt = require('bcryptjs');

// La contraseña a encriptar se pasa como argumento: node bcrypt.js "<contraseña>"
const plainPassword = process.argv[2];

if (!plainPassword) {
    console.error('Uso: node bcrypt.js "<contraseña>"');
    process.exit(1);
}

// Generar el hash de la contraseña
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) throw err;
    console.log('Contraseña Hasheada:', hash);
});
