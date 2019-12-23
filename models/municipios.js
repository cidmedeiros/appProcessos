mongoose = require('mongoose');

const municipioSchema = new mongoose.Schema({
	agrpUf: String,
	municipios:[
		{
			nome: String,
			nomeUf: String,
			'uf': String,
			'ibge': String,
			'regiao': String
		}
	]
});

module.exports = mongoose.model('Municipio', municipioSchema);