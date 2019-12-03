mongoose = require('mongoose');
Municipio = require('./municipios');
Ies = require('./ies');
Programa = require('./programa');

const bolsistaSchema = new mongoose.Schema({
	cpf: String,
	nome: String,
	sei: String,
	email: [{email:String, data:Date}],
	sexo: String,
	statusCurso: [{status:{sit:String, dataSit: Date}, data: Date}],
	clbr: [{nome: String, data: Date}],
	valorBolsas: [{valor: Number, data: Date}],
	valorDev: [{valor: Number, data: Date}],
	docFoto: [
		{
			doc: String,
			regular: [{sit:Boolean, data: Date}],
			motivo: [{tipo: String,	data: Date}]
		}
	],
	termo: [
		{
			regular: [{sit:Boolean, data: Date}],
			motivo: [{tipo: String,	data: Date}]
		}
	],
	declaracao: [
		{
			escola: {
				municipio: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Municipio'
				}
			},
			permanencia: Number,
			regular: [{sit:Boolean, data: Date}],
			motivo: [{tipo: String, data: Date}]
		}
	],
	certConclusao: [
		{
			ies: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			},
			regular: [{sit:Boolean, data: Date}],
			motivo: [{tipo: String,	data: Date}]
		}
	],
	analiseCompromisso: {
		regular: [{sit:Boolean, data: Date}],
		motivo: [{tipo:String, data:Date}]
	},
	pad: {
		regular: [{sit:Boolean, data: Date}],
		obsv: [{obs: String, data: Date}],
		tramite: [
			{
				tipo: String,
				acao: String,
				inicioTramite: Date,
				fimTramite: Date,
			}
		],
		situacao:[{tipo: String, data: Date}]
	},
	pags: [
		{
			dataRef: Date,
			dataPag: mongoose.Schema.Types.Mixed,
			sistema: String,
			valor: Number,
			turma: String,
			modalidade: String,
			programa: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Programa'
			},
			iesLocal: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			}
		}
	]
});

//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
module.exports = mongoose.model('Bolsista', bolsistaSchema);