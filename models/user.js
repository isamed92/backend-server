const mongoose = require('mongoose');


// -------------------------
// Var Schema 
// -------------------------
let Schema = mongoose.Schema;

// -------------------------
// Schema Definition
// -------------------------
let userSchema = new Schema({
	name: { type: String, required: [true, 'El nombre es necesario'] },
	email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
	role: { type: String, required: true, default: 'USER_ROLE'}
});

// EXPORT SCHEMA FOR USING OUTSIDE THIS FILE
module.exports = mongoose.model('User', userSchema);