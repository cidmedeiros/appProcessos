mongoose = require('mongoose');
Municipio = require('./municipios');
Ies = require('./ies');
Programa = require('./programa');

const bolsistaSchema = new mongoose.Schema({
	cpf: String,
	nome: String,
	sei: String,
	email: [String],
	sexo: String,
	docFoto: [
		{
			doc: String,
			regular: Boolean,
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
			regular: Boolean,
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
			regular: Boolean,
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
			regular: Boolean,
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
				nome: String,
				municipio: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Municipio'
				}
			},
			permanencia: Number,
			regular: Boolean,
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
			regular: Boolean,
			motivo: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],	
	statusCurso: [String],
	conclusao: Date,
	turma: [
		{
			tipo: String,
			inicio: Date,
			fim: Date
		}
	],
	programa: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Programa'
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
	clbr: [String],
	obsv: [String],
	analiseComp: [
		{
			regular: Boolean,
			situacao: {tipo:String, data:Date},
			pendencia: [
				{
					tipo: String,
					data: Date
				}
			]
		}
	],
	pad: {
		regular: Boolean,
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
	pag: [
		{
			dataRef: Date,
			dataPag: Schema.Types.Mixed,
			sistema: String,
			valor: Number,
		}
	]
});


//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
module.exports = mongoose.model('Bolsista', bolsistaSchema);