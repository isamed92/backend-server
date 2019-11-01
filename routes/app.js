const express = require('express');

const app = express();

// Rutas
app.get('/', (request, response, next) => {
	response.status(200).json({
		ok: true,
		message: 'OK'
	});
});

module.exports = app;
