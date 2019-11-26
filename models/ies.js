mongoose = require('mongoose');

const iesSchema = new mongoose.Schema({
	nome: String,
	sigla: String,
	municipio: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Municipio'
		}
});

module.exports = mongoose.model('Ies', iesSchema);