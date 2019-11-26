mongoose = require('mongoose');

const municipioSchema = new mongoose.Schema({
	ibge: String,
	nome: String,
	uf: String
});

module.exports = mongoose.model('Municipio', municipioSchema);