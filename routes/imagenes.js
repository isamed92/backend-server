// THIS ROUTE IS FOR CREATE URL FOR SEE IMAGES

const express = require('express');

const app = express();

const path = require('path');
const fs = require('fs');


// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-photo.png');
        res.sendFile(pathNoImage);
    }

});

module.exports = app;
