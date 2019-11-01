// Requires = importacion de librerias
const express = require('express');
const mongoose = require('mongoose');


var bodyParser = require('body-parser')

// Iniciar variables
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// conexion a la base de datos
mongoose.connection.openUri(
	'mongodb://localhost:27017/hospitalDB',
	(err, response) => {
		if (err) throw err;	
		console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
	}
);

// IMPORT ROUTES
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');

// Escuchar Peticiones
app.listen(3000, () => {
	console.log(
		'express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m',
		'online'
	);
});

// Routes
// middleware declaration
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);
