mongoose = require('mongoose');
mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
Municipio = require('./municipios');
Ies = require('./ies');
Programa = require('./programa');

const bolsistaSchema = new mongoose.Schema({
	cpf: String,
	nome: String,
	nomeDisplay: String,
	sei: String,
	email: [{email:String, data:Date}],
	sexo: String,
	statusCurso: [{status:String, data: Date, user: String}],
	permanenciaTotal: Number,
	clbr: [{nome: String, idClbr:Number, data: Date}],
	valorBolsas: Number,
	valorDev: [{valor: Number, data: Date, user: String}],
	docFoto: [
		{
			doc: String,
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	docRes: [
		{
			doc: String,
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	termo: [
		{
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	declaracao: [
		{
			municipioEscola: {
				nome: String,
				uf: String
			},
			permanencia: mongoose.Schema.Types.Mixed,
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	certConclusao: [
		{
			ies: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Ies'
			},
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	analiseCompromisso: [
		{
			regular: String,
			obsv: String,
			user: String,
			data: Date,
		}
	],
	pad: [
		{
		tramite: {tipo: String, acao: String, inicioTramite: Date, fimTramite: Date},
		situacao: String,
		regular: String,
		obsv: String,
		user: String,
		data: Date
		}
	],
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

bolsistaSchema.plugin(mongoose_fuzzy_searching, {fields: ['nome']});

//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
module.exports = mongoose.model('Bolsista', bolsistaSchema);