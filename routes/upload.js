const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
var fileSystem = require('fs');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

//? middleware
app.use(fileUpload());

    //! PUT
    app.put('/:tipo/:id', (req, res)=>{
        if(!req.files){
            return res.status(400).json({ok: false, mensaje: 'no selecciono nada', errors: {message: 'debe de seleccionar una imagen'}});
        }
        //* VALIDACIONES
        //? OBTENER EL NOMBRE DEL ARCHIVO
        var archivo = req.files.imagen;
        var nombreCortado = archivo.name.split('.');
        var extensionArchivo = nombreCortado[nombreCortado.length-1];
        
        //? SOLO SE ACEPTAN LAS SIGUIENTES EXTENCIONES
        var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

        if(extencionesValidas.indexOf(extensionArchivo) < 0){
            return res.status(400).json({ok: false, mensaje: 'EXTENSION NO VALIDA', errors: {message: 'Las extensiones validas son: ' + extencionesValidas.join(', ')}});            
        }
        //? NOMBRE DE ARCHIVO PERSONALIZADO
        var tipo = req.params.tipo;
        var id = req.params.id;
        

        var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

        //? MOVER EL ARCHIVO DEL TEMPORAL A UN PATH

        //* TIPOS DE COLECCION
        var tiposValidos = ['medicos', 'hospitales', 'usuarios'];
        if(tiposValidos.indexOf(tipo) < 0 ){
            return res.status(400).json({ok: false, mensaje: 'TIPO DE CONEXION NO ES VALIDA', errors: {message: 'Las conexciones validas son: ' + tiposValidos.join(', ')}});            
        }
        var path = `./uploads/${tipo}/${nombreArchivo}`;

        archivo.mv(path, err =>{
            if(err){
                return res.status(500).json({ok: false, mensaje: 'ERROR AL MOVER ARCHIVO', errors: err});            
            }

            subirPorTipo(tipo, id, nombreArchivo, res);
            // res.status(200).json({ok: true, mensaje: 'archivo movido', archivo});
        });

    });


    function subirPorTipo(tipo, id, nombreArchivo, res){
        if(tipo === 'usuarios'){
            Usuario.findById(id, (err, usuario)=>{
                if(!usuario){
                    res.status(400).json({ok: false, mensaje: 'no existe un usuario', errors: err});
                }
                var pathOld = `./uploads/usuarios/${usuario.img}`;
                //? Si existe, elimina la imagen anterior
                if(fileSystem.existsSync(pathOld)){
                    fileSystem.unlink(pathOld);
                }
                usuario.img = nombreArchivo;
                usuario.save((err, usuarioActualizado) => {
                    usuarioActualizado.password = 'D:';
                    return res.status(200).json({ok: true, mensaje: 'imagen de usuario actualizada', usuario: usuarioActualizado});
                });
            });

        }
        if(tipo === 'medicos'){
            Medico.findById(id, (err, medico)=>{
                if(!medico){
                    res.status(400).json({ok: false, mensaje: 'no existe un medico', errors: err});
                }
                var pathOld = `./uploads/medicos/${medico.img}`;
                //? Si existe, elimina la imagen anterior
                if(fileSystem.existsSync(pathOld)){
                    fileSystem.unlink(pathOld);
                }
                medico.img = nombreArchivo;
                medico.save((err, medicoUpdated) => {
                    return res.status(200).json({ok: true, mensaje: 'imagen de medico actualizada', medico: medicoUpdated});
                });
            });
        }
        if(tipo === 'hospitales'){
            if(!hospital){
                res.status(400).json({ok: false, mensaje: 'no existe un hospital', errors: err});
            }
            Hospital.findById(id, (err, hospital)=>{
                var pathOld = `./uploads/usuarios/${hospital.img}`;
                //? Si existe, elimina la imagen anterior
                if(fileSystem.existsSync(pathOld)){
                    fileSystem.unlink(pathOld);
                }
                hospital.img = nombreArchivo;
                hospital.save((err, hospitalUpdated) => {
                    return res.status(200).json({ok: true, mensaje: 'imagen de hospital actualizada', hospital: hospitalUpdated});
                });
            });
        }


    }

module.exports = app;
