var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/usuario');
var SEED = require('../config/config').SEED;

var CLIENT_ID = require('../config/config').CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//? AUTENTICACION DE GOOGLE

async function verify(token) {
	const ticket = await client.verifyIdToken({
		idToken: token,
		audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
		// Or, if multiple clients access the backend:
		//[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
	});
	const payload = ticket.getPayload();
	// const userid = payload['sub'];
	// If request specified a G Suite domain:
	//const domain = payload['hd'];

	return {
		nombre: payload.name,
		email: payload.email,
		img: payload.picture,
		google: true,
		payload: payload
	};
}

app.post('/google', async (req, res) => {
	var token = req.body.token;
	var googleUser = await verify(token).catch(err => {
		if (err) {
			return res.status(400).json({ ok: false, message: 'token incorrecto' });
		}
	});

	Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
		if (err) {
			return res
				.status(500)
				.json({ ok: false, message: 'error al buscar usuario', errors: err });
		}

		if (usuarioDB) {
			if (usuarioDB.google === false) {
				return res.status(500).json({
					ok: false,
					message: 'Debe usar su autenticacion normal',
					errors: err
				});
			} else {
				var token = jwt.sign({ usuario: usuarioDB }, SEED, {
					expiresIn: 14400
				}); //4 horas

				res.status(200).json({
					ok: true,
					usuario: usuarioDB,
					id: usuarioDB._id,
					token: token
				});
			}
		} else {
			//! el usuario no existe...hay que crearlo
			var usuario = new Usuario({
				nombre: googleUser.nombre,
				email: googleUser.email,
				img: googleUser.img,
				google: true,
				password: 'c:'
			});
			usuario.save((err, usuarioDB) => {
				var token = jwt.sign({ usuario: usuarioDB }, SEED, {
					expiresIn: 14400
				}); //4 horas

				res.status(200).json({
					ok: true,
					usuario: usuarioDB,
					id: usuarioDB.id,
					token
				});
			});
		}
	});

	// return res.status(200).json({ ok: true, message: 'OK', googleUser: googleUser});
});

//! AUTENTICACION NORMAL
app.post('/', (req, res) => {
	var body = req.body;

	Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
		if (err) {
			return res
				.status(500)
				.json({ ok: false, message: 'error al buscar usuario', errors: err });
		}

		if (!usuarioDB) {
			return res.status(400).json({
				ok: false,
				message: 'credenciales incorrectas - email',
				errors: err
			});
		}

		if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
			return res.status(400).json({
				ok: false,
				message: 'credenciales incorrectas - password',
				errors: err
			});
		}

		usuarioDB.password = ':)';

		var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); //4 horas

		res.status(200).json({
			ok: true,
			usuario: usuarioDB,
			id: usuarioDB.id,
			token
		});
	});
});

module.exports = app;
