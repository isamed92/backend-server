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
let appRoutes = require('./routes/app');
let usersRoutes = require('./routes/user');
let loginRoutes = require('./routes/login');

// Escuchar Peticiones
app.listen(3000, () => {
	console.log(
		'express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m',
		'online'
	);
});

// Routes
// middleware declaration
app.use('/users', usersRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
