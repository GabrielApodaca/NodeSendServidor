const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear servidor
const app = express();
console.log("Comenzando Node Send");

// Conectar a la base de dato
conectarDB();

// Puerto de la app
const port = process.env.PORT || 4000;

// Habilitar leer los valores del body
const opcionesCORS = {
    origin: process.env.FRONTEND_URL
};
app.use( express.json(opcionesCORS) );

// Habilitar CORS
app.use( cors() );

// Habilitar carpeta publica
app.use( express.static('uploads') );

// Rutas de la app
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/enlaces', require('./routes/enlaces'));
app.use('/api/archivos', require('./routes/archivos'));

// Iniciar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});