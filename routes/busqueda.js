const express = require('express');

const app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//! BUSQUEDA GENERAL
app.get('/todo/:busqueda', (req, res, next) => {
	var busqueda = req.params.busqueda;
	var expresionRegular = new RegExp(busqueda, 'i');

	Promise.all([
		buscarHospitales(busqueda, expresionRegular),
		buscarMedicos(busqueda, expresionRegular),
		buscarUsuarios(busqueda, expresionRegular)
	]).then(respuestas => {
		res.status(200).json({
			ok: true,
			hospitales: respuestas[0],
			medicos: respuestas[1],
			usuarios: respuestas[2]
		});
	});

});



//? BUSQUEDA POR COLECCION
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
	var busqueda = req.params.busqueda;
	var expresionRegular = new RegExp(busqueda, 'i');
	var tabla = req.params.tabla;
	var promesa;

	switch (tabla) {
		case 'usuario':
			promesa = buscarUsuarios(busqueda, expresionRegular);
			break;
		case 'medico':
			promesa = buscarMedicos(busqueda, expresionRegular);
			break;
		case 'hospital':
			promesa = buscarMedicos(busqueda, expresionRegular);
			break;
		default:
			return res
				.status(400)
				.json({ ok: false, message: 'no existe una coleccion con ese nombre' });
	}

	promesa.then(data => {
		res.status(200).json({ ok: false, [tabla]: data });
	});
});

function buscarHospitales(busqueda, regex) {
	return new Promise((resolve, reject) => {
		Hospital.find({ nombre: regex })
			.populate('usuario', 'nombre email')
			.exec((err, hospitales) => {
				if (err) {
					reject('Error al cargar hospitales: ', err);
				} else {
					resolve(hospitales);
				}
			});
	});
}
function buscarMedicos(busqueda, regex) {
	return new Promise((resolve, reject) => {
		Medico.find({ nombre: regex })
			.populate('usuario', 'nombre email')
			.populate('hospital')
			.exec((err, medicos) => {
				if (err) {
					reject('Error al cargar medicos: ', err);
				} else {
					resolve(medicos);
				}
			});
	});
}

function buscarUsuarios(busqueda, regex) {
	return new Promise((resolve, reject) => {
		Usuario.find({}, 'nombre email role')
			// para hacer una busqueda de dos columnas de la tabla de la base de datos
			.or([{ nombre: regex }, { email: regex }])
			.exec((err, usuarios) => {
				if (err) {
					reject('Error al cargar usuarios: ', err);
				} else {
					resolve(usuarios);
				}
			});
	});
}

module.exports = app;
