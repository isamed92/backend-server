// Requires = importacion de librerias
const express = require('express');
const mongoose = require('mongoose');

// Iniciar variables
const app = express();


// conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, response) => {
    if(err) throw err;
    console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');



});
// Rutas
app.get('/', (request, response, next)=>{

    response.status(200).json({
        ok: true, 
        message: 'OK'
    });

});


// Escuchar Peticiones
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});


