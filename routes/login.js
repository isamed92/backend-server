var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var app = express();
var Usuario = require('../models/user');
var SEED = require('../config/config').SEED;

app.post('/', (req, res)=>{

    var body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB)=>{
        if(err){
            return res.status(500).json({ok: false, message: 'error al buscar usuario', errors: err});
        }

        if(!usuarioDB){
            return res.status(400).json({ok: false, message: 'credenciales incorrectas - email', errors: err});
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({ok: false, message: 'credenciales incorrectas - password', errors: err});
        }  

        usuarioDB.password = ':)';

        // todo: crear un token!
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400}); //4 horas



        res.status(200).json({
            ok: true, usuario: usuarioDB, id: usuarioDB.id, token
        });
    });





    
});


module.exports = app;