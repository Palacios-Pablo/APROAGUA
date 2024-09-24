const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Backend de APROAGUA funcionando');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
