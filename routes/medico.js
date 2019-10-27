var express = require('express');
var middlewareAuth = require('../middlewares/authentication');

var app = express();

var Medico = require('../models/medico');

//!GET
app.get('/', (req, res) => {
    Medico.find({}, '_id nombre img usuario').exec((err, medicos) => {
        if (err) {res.status(500).json({ ok: false, message: 'Error GET medico', errors: err });}
        res.status(200).json({ ok: true, medicos });
    });

});

//? POST
app.post('/', middlewareAuth.verificaToken, (req, res, next)=>{
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });
    medico.save( (err, medicoGuardado)=>{
        if(err){
            return res.status(400).json({ok: false, meesage: 'Error al crear el medico: ' + medico.nombre, errors: err})
        }
        res.status(200).json({ok: true, medico: medicoGuardado});
    });
});


//! PUT
app.put('/:id', middlewareAuth.verificaToken, (req, res)=>{
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico)=>{
        if(err){
        }
        if(!medico){
            res.status(400).json({ok: false, message: 'medico con id: '+ id + ' no encontrado (no existe)', errors: err});
        }

        medico.nombre = body.nombre;
        // medico.img = req.body.img;
        medico.usuario = body.usuario;
        medico.hospital = body.hospital;
        medico.save( (err, medicoSave) => {
            if(err){
                res.status(400).json({ok: false, message: 'ERROR: update medico error', errors: err});
            }
            res.status(200).json({ok: true, medico: medicoSave});
        });
    });
});
//? DELETE
app.delete('/:id', middlewareAuth.verificaToken, (req, res)=>{
    var id = req.params.id;


    Medico.findByIdAndDelete(id, (err, medicoDelete)=>{
        if(err){
            res.status(500).json({ok: false, message: 'ERROR: delete medico error', errors: err});
        }
        if(!medicoDelete){
            res.status(400).json({ok: false, message: 'medico con id: '+ id + ' no encontrado (no existe)', errors: err});
        }
        res.status(200).json({ok: true, medico:medicoDelete})
    });
});
module.exports = app;
