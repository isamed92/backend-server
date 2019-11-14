let express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var middlewareAuth = require('../middlewares/authentication');

let app = express();

let Usuario = require('../models/usuario');

// Rutas
app.get('/', (request, response, next) => {
	var desde = request.query.desde || 0;
	desde = Number(desde);
	Usuario
		.find({}, '_id nombre email img role')
		.skip(desde)
		.limit(5)
		.exec((err, usuarios) => {
			if (err) {
				return response.status(500).json({
					ok: false,
					message: 'Error cargando usuarios',
					errors: err
				});
			}
			Usuario.count({}, (err, conteo)=>{
				response.status(200).json({
					ok: true,
					total: conteo,
					usuarios: usuarios
				});
			});
	});
	// response.status(200).json({
	//     ok: true,
	//     message: 'OK - Get usuarios'
	// });
});




app.post('/', [], (request, response, next) => {
    // PARA MANDAR POR URLENCODED NECESITAMOS IMPORTAR EL BODY PARSER EN app.js
    let body = request.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        role: body.role,
        email: body.email,
        img: body.img,
        password: bcrypt.hashSync(body.password, 10)
    });

    usuario.save( (err, usuarioSaved) => {
        if (err) {
			return response.status(400).json({
				ok: false,
				message: 'Error al crear usuario',
				errors: err
			});
		}

        response.status(201).json({
            ok: true,
			usuario: usuarioSaved,
			usuarioToken: request.usuario
        });
    });
}); //END POST




// actualizar usuario
app.put('/:id',middlewareAuth.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body = req.body;

	Usuario.findById(id, (err, usuario)=>{
		if (err) {
			return res.status(500).json({
				ok: false,
				message: 'Error al buscar usuario',
				errors: err
			});
		}
		if(!usuario){
			return res.status(400).json({
				ok: false,
				message: 'Error: el usuario'+ id +'no existe',
				errors: {
					message: 'no existe un usuario con ese id'
				}
			});
		}

		usuario.nombre = body.nombre;
		usuario.email = body.email;
		usuario.role = body.role;
		usuario.save(  (err, usuarioGuardado)=> {
			if(err){
				return res.status(400).json({
					ok: false,
					mensaje: 'error al actualizar el usuario',
					errors: err
				});
			}
			usuarioGuardado.password = '>:)';
			res.status(200).json({
				ok: true,
				usuarioGuardado
			});
		});
	});


});

// BORRAR USUARIO

app.delete('/:id',middlewareAuth.verificaToken, (req, res) =>{
	var id = req.params.id;

	Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=>{
		if(err){
			return res.status(500).json({
				ok: false, mensaje: 'error al borrar usuario', errors: err
			});
		}
		if(!usuarioBorrado){
			return res.status(400).json({
				ok: false, mensaje: 'no existe un usuario con ese id', errors: err
			});
		}
		res.status(200).json({
			ok: true,
			usuarioBorrado
		});
	});
});

module.exports = app;
