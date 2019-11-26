mongoose = require('mongoose');

const bolsistaSchema = new mongoose.Schema({
	cpf: String,
	nome: String,
	sexo: String,
	colaborador: String
});

//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
module.exports = mongoose.model('Bolsista', bolsistaSchema);