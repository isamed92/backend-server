var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
	jwt.verify(token, SEED, (err, decoded)=>{
		if(err){
			return res.status(401).json({ok: false, message:'token invalido', errors: err});
        }
        // res.status(200).json({ok: true, decoded});
        req.usuario = decoded.usuario;
		next(); // hace que puedas continuar con cualquiera de las funciones de abajo (post, put, delete)
	});
}
