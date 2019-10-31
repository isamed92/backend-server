const express = require('express');

const app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// Rutas
app.get('/todo/:busqueda', (req, res, next) => {
	var busqueda = req.params.busqueda;
	var expresionRegular = new RegExp(busqueda, 'i');

	Promise.all([
		buscarHospitales(busqueda, expresionRegular),
		buscarMedicos(busqueda, expresionRegular),
		buscarUsuarios(busqueda, expresionRegular)
	]).then(respuestas => {
		res
			.status(200)
			.json({ ok: true, hospitales: respuestas[0], medicos: respuestas[1], usuarios: respuestas[2] });
	});

	// buscarHospitales(busqueda,expresionRegular)
	//           .then(hospitales => {
	//               res.status(200).json({ok: true, hospitales: hospitales});
	//           });
	// Hospital.find({nombre: expresionRegular}, (err, hospitales)=>{
	//     res.status(200).json({ok: true, hospitales: hospitales});
	// });
});

function buscarHospitales(busqueda, regex) {
	return new Promise((resolve, reject) => {
		Hospital.find({ nombre: regex }, (err, hospitales) => {
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
		Medico.find({ nombre: regex }, (err, medicos) => {
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
		Usuario.find()
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
