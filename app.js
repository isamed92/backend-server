// Requires = importacion de librerias
const express = require('express');
const mongoose = require('mongoose');


var bodyParser = require('body-parser')

// Iniciar variables
const app = express();

// middleware CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header('Access-Control-Allow-Methods', "POST, GET, PUT, DELETE, OPTIONS")
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// conexion a la base de datos
mongoose.connection.openUri(
	'mongodb://localhost:27017/hospitalDB',
	 { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
	(err, response) => {
		if (err) throw err;
		console.log('base de datos: \x1b[32m%s\x1b[0m', 'online');
	}
);

// SERVER INDEX CONFIG
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

// IMPORT ROUTES
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

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
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);
