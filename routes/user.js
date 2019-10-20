let express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
// var SEED = require('../config/config').SEED;
var middlewareAuth = require('../middlewares/authentication');

let app = express();

let User = require('../models/user');

// Rutas
app.get('/', (request, response, next) => {
	User.find({}, '_id name email img role').exec((err, users) => {
		if (err) {
			return response.status(500).json({
				ok: false,
				message: 'Error cargando usuarios',
				errors: err
			});
		}
		response.status(200).json({
			ok: true,
			users: users
		});
	});
	// response.status(200).json({
	//     ok: true,
	//     message: 'OK - Get users'
	// });
});




app.post('/', middlewareAuth.verificaToken, (request, response, next) => {
    // PARA MANDAR POR URLENCODED NECESITAMOS IMPORTAR EL BODY PARSER EN app.js
    let body = request.body;
    let user = new User({
        name: body.name,
        role: body.role,
        email: body.email,
        img: body.img,
        password: bcrypt.hashSync(body.password, 10)
    });
 
    user.save( (err, userSaved) => {
        if (err) {
			return response.status(400).json({
				ok: false,
				message: 'Error al crear usuario',
				errors: err
			});
		}

        response.status(201).json({
            ok: true,
			user: userSaved,
			userToken: request.usuario
        });
    });
}); //END POST




// actualizar usuario
app.put('/:id',middlewareAuth.verificaToken, (req, res)=>{
	var id = req.params.id;
	var body = req.body;

	User.findById(id, (err, usuario)=>{
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

		usuario.name = body.name;
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

	User.findByIdAndRemove(id, (err, usuarioBorrado)=>{
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
