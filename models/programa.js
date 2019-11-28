mongoose = require('mongoose');
Ies = require('./ies')

const programaSchema = new mongoose.Schema({
	nome: String,
	coordNacional: [
		{
			ies: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			},
			inicio: Date,
			fim: Date
		}
	]
});

module.exports = mongoose.model('Programa', programaSchema);