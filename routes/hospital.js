var express = require('express');
var bcrypt = require('bcryptjs');
var middlewareAuth = require('../middlewares/authentication');

var app = express();

var Hospital = require('../models/hospital');

//!GET
app.get('/', (req, res) => {
    Hospital.find({}, '_id nombre img usuario').exec((err, hospitales) => {
        if (err) {res.status(500).json({ ok: false, message: 'Error GET hospitales', errors: err });}
        res.status(200).json({ ok: true, hospitales });
    });

});

//? POST
app.post('/', middlewareAuth.verificaToken, (req, res, next)=>{
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario
    });
    hospital.save( (err, hospitalGuardado)=>{
        if(err){
            return res.status(400).json({ok: false, meesage: 'Error al crear el Hospital: ' + hospital.nombre, errors: err})
        }
        res.status(200).json({ok: true, hospital: hospitalGuardado})
    });
});


//! PUT
app.put('/:id', middlewareAuth.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital)=>{
        if(err){
        }
        if(!hospital){
            res.status(400).json({ok: false, message: 'hospital con id: '+ id + ' no encontrado (no existe)', errors: err});
        }

        hospital.nombre = req.body.nombre;
        // hospital.img = req.body.img;
        hospital.usuario = req.body.usuario;
        hospital.save( (err, hospitalSave) => {
            if(err){
                res.status(400).json({ok: false, message: 'ERROR: update hospital error', errors: err});
            }
            res.status(200).json({ok: true, hospital: hospitalSave});
        });
    });
});
//? DELETE
app.delete('/:id', middlewareAuth.verificaToken, (req, res)=>{
    var id = req.params.id;


    Hospital.findByIdAndDelete(id, (err, hospitalDelete)=>{
        if(err){
            res.status(500).json({ok: false, message: 'ERROR: delete hospital error', errors: err});
        }
        if(!hospitalDelete){
            res.status(400).json({ok: false, message: 'hospital con id: '+ id + ' no encontrado (no existe)', errors: err});
        }
        res.status(200).json({ok: true, hospital:hospitalDelete})
    });
});
module.exports = app;
