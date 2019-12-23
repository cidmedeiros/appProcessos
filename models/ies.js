mongoose = require('mongoose');
Municipio = require('./municipios')

const iesSchema = new mongoose.Schema(
	{
		cnpj: String,
		sigla: String,
		nome: String,
		nomeUf: String,
		uf: String,
		regiao: String
	}
);

module.exports = mongoose.model('Ies', iesSchema);