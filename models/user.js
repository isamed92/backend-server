const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// -------------------------
// Var Schema 
// -------------------------
let Schema = mongoose.Schema;


var rolesValidos = {
	values: ['ADMIN_ROLE','USER_ROLE'],
	message: '{VALUE} no es un rol valido'
};
// -------------------------
// Schema Definition
// -------------------------
let userSchema = new Schema({
	name: { type: String, required: [true, 'El nombre es necesario'] },
	email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
	role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser unico'});

// EXPORT SCHEMA FOR USING OUTSIDE THIS FILE
module.exports = mongoose.model('User', userSchema);