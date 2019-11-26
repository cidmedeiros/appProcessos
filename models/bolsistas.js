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
	docFoto: [
		{
			doc: String,
			regular: [{sit:Boolean, data: Date}],
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],
	docRes:[
		{
			doc: String,
			regular: [{sit:Boolean, data: Date}],
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],
	respInst: [
		{
			doc: String,
			regular: [{sit:Boolean, data: Date}],
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],
	termo: [
		{
			regular: [{sit:Boolean, data: Date}],
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
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
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],
	certCon: [
		{
			ies: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			},
			regular: [{sit:Boolean, data: Date}],
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],	
	statusCurso: [{status: String, data: Date}],
	conclusao: [{sit:String, data: Date}],
	turma: [
		{
			tipo: String,
			inicio: Date,
			fim: Date
		}
	],
	programa: [{
			programa:
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Programa'
			},
			inicio: Date,
			fim: Date
		}
	],
	iesLocal: [
		{
			ies: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			},
			inicio: Date,
			fim: Date
		}
	],
	clbr: [{nome: String, data: Date}],
	obsv: [{obs: String, data: Date}],
	analiseComp: [
		{
			regular: [{sit:Boolean, data: Date}],
			situacao: {tipo:String, data:Date},
			pendencia: [
				{
					tipo: String,
					data: Date
				}
			],
			data: Date
		}
	],
	pad: {
		regular: [{sit:Boolean, data: Date}],
		situacao:[
			{
				tipo: String,
				data: Date
			}
		],
		pendencia: [
			{
				tipo: String,
				data: Date
			}
		],
		tramite: [
			{
				tipo: String,
				acao: String,
				data: Date
			}
		]
	},
	pags: [
		{
			dataRef: Date,
			dataPag: mongoose.Schema.Types.Mixed,
			sistema: String,
			valor: Number,
		}
	]
});


//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
module.exports = mongoose.model('Bolsista', bolsistaSchema);