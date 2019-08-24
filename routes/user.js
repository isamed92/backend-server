let express = require('express');

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
	// });s
});


app.post('/', (request, response, next) => {
    // PARA MANDAR POR URLENCODED NECESITAMOS IMPORTAR EL BODY PARSER EN app.js
    let body = request.body;
    let user = new User({
        name: body.name,
        role: body.role,
        email: body.email,
        img: body.img,
        password: body.password
    });
 
    user.save( (err, userSaved) => {
        if (err) {
			return response.status(500).json({
				ok: false,
				message: 'Error al crear usuario',
				errors: err
			});
		}

        response.status(201).json({
            ok: true,
            user: userSaved
        });
    });

    




}); //END POST

module.exports = app;
