mongoose = require('mongoose');

const municipioSchema = new mongoose.Schema({
	nome: String,
	nomeUf: String,
	'uf': String,
	'ibge': String,
	'regiao': String
});

module.exports = mongoose.model('Municipio', municipioSchema);