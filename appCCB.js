//Required External Modules
path = require("path");
express = require('express');
http = require("http");
bodyParser = require('body-parser');
mongoose = require('mongoose');
mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
methodOverride = require('method-override');
expressSanitizer = require('express-sanitizer');
tools = require('./assets/scripts/tools');
Bolsista = require('./models/bolsistas');
Ies = require('./models/ies');
Municipio = require('./models/municipios');

//App Variable
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static('assets'));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
const hostname = `${tools.getLocalIp()}`;
const port = 8087;

//Set DataBase
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Routes Definitions

	//INDEX ROUTE - Lists all the related data from DB
app.get('/', async (req, res) =>{
	console.log('Waiting...');
	res.render('landing');
});

	//SHOW ROUTES
app.get('/paginadobolsista/:id', async (req, res) => {
	try{
		await Bolsista.findById(req.params.id).populate('pags.iesLocal').populate('certConclusao.ies')
		.populate([
			{
				path: 'pags.programa',
				model:'Programa',
				populate:{
					path:'coordNacional.ies',
					model:'Ies'
				}
			}
		]).exec(async (err, foundBol) => {
			if(err){
				console.log(`Bolsista ${req.params.cpf} not found! Error: ${err}`);
			} else {
				console.log('Id found!');
				await Ies.find({}, async (err, entidades) =>{
					if(err){
						console.log(`Error fetching Ies collection in Id -> ${err}`)
					} else {
						await Municipio.find({}, async (err, municipios) => {
							if(err){
								console.log(`Error fetching Municipios collection in Id -> ${err}`)
							} else{
								res.render('showBolsista', {bolCons:foundBol, entidades:entidades, municipios:municipios});
							}
						})						
					}
				});
			}
		});
	} catch(error){
		console.log(`Error trying to find ${req.params.cpf}, ${error} by catch`)
	}
});

app.post('/consultabolsista', async (req, res) => {
	let input = req.body.consulta;
	input = await tools.treatInput(input);
	try{
		if(input[0] === 'cpf'){
			await Bolsista.findOne({cpf:input[1]}, async (err, foundBol) => {
				if(err){
					console.log(`Bolsista ${input[1]} not found! ${err}`);
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'sei'){
			await Bolsista.findOne({sei:input[1]}, async (err, foundBol) => {
				if(err){
					console.log(`Error tryng to find ${input[1]}, ${err}`);
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'nome'){
			console.log(`nome to be passed to fuzzySearch: ${input[1]}`);
			await Bolsista.fuzzySearch({nome:input[1]}, (err, foundBol) => {
				if(err){
					console.log(`Error tryng to find ${input[1]}, ${err}`);
				} else {
					console.log(`Result from fuzzySearch: ${foundBol}`);
					if(foundBol.lenght === 1){
						res.redirect(`/paginadobolsista/${foundBol._id}`);
					} else {
						console.log('--------------------------');
						console.log('nomesss found!');
						console.log(foundBol.lenght);
						console.log(foundBol);
						console.log('redirecting to showResultados');
						res.render('showResultados', {bolCons:foundBol});
						console.log('End of server execution!');
					}
				}
			});
		} else {
			res.render('landing');
			alert(input[0]);
		}
	} catch(error){
		console.log(`Error trying to find ${input[1]}, ${error} by catch`)
	}
});

	//PUT ROUTES (UPDATE ROUTES)
app.put('/editardadospessoais/:cpf', (req, res) => {
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{'email':{'email':req.body.bolsista.email, 'data': new Date()},
						'docFoto':{'doc': req.body.bolsista.tipoDocFoto,'regular':req.body.bolsista.regDocFoto,'obsv':req.body.bolsista.obsvDocFoto,'data': new Date(),'user':'tester'},
						'docRes':{'doc': req.body.bolsista.tipoDocRes,'regular':req.body.bolsista.regDocRes,'obsv':req.body.bolsista.obsvDocRes,'data': new Date(),'user':'tester'},
						'termo':{'regular':req.body.bolsista.regTermo,'obsv':req.body.bolsista.obsvTermo,'data': new Date(),'user':'tester'}},
				'sexo': req.body.bolsista.sexo
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					res.redirect(`/paginadobolsista/${upObejct._id}`);
				}
		});
	} catch {
		console.log('Error updating email/sexo');
	}
});

app.put('/editarcompromisso/:cpf', async (req, res) =>{
	//Ies
	try{
		var iesUpdate;
		await Ies.findOne({sigla:req.body.bolsista.iesCert}, async (err, foundIes) => {
			if(err){
				console.log('------------------------------------');
				console.log(`First Promise Internal error finding Ies ${err}`)
				console.log('------------------------------------');
			} else{
				iesUpdate = foundIes._id;
			}
		});
	} catch(error){
		console.log('------------------------------------');
		console.log(`First Promise External error finding Ies ${error}`);
		console.log('------------------------------------');
	}
	
	//Push Docs
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{

					'statusCurso':{status:req.body.bolsista.status, data: new Date(req.body.bolsista.dataConcl), user:'teste'},
					'certConclusao':{ies:iesUpdate,regular:req.body.bolsista.regCert,obsv:req.body.bolsista.obsvCert,user:'teste',data: new Date()},
					'analiseCompromisso':{regular:req.body.bolsista.resAna,obsv:req.body.bolsista.obsvAna, user:'teste', data: new Date()}
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log('------------------------------------');
					console.log(`First Promise Internal error updating ${err}`);
					console.log('------------------------------------');
				} else{
					res.redirect(`/paginadobolsista/${upObejct._id}`);
				}
			});
	} catch(error) {
		console.log('------------------------------------');
		console.log(`Exit Promise External error updating ${error}`);
		console.log('------------------------------------');
	}
});

app.put('/adddeclaracao/:cpf',  async (req, res) =>{
	//Push Declaracao
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{
					'declaracao':{municipioEscola:{nome:req.body.bolsista.munDecl, uf:req.body.bolsista.ufDecl}, permanencia:parseInt(req.body.bolsista.perm, 10), regular:req.body.bolsista.regDecl, obsv:req.body.bolsista.obsvDecl, user:'teste', data: new Date()},
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log('------------------------------------');
					console.log(`First Promise Internal error updating ${err}`);
					console.log('------------------------------------');
				} else{
					Bolsista.findOne({cpf:req.params.cpf}, async (err, foundBol) => {
						if(err){
							console.log('------------------------------------');
							console.log(`Second Promise Internal error finding bolsista ${err}`)
							console.log('------------------------------------');
						} else{
							console.log(foundBol.declaracao)
							var newPerm = await tools.calcPerm(foundBol.declaracao);
							console.log(`newPerm: ${newPerm}`);
							Bolsista.findOneAndUpdate({cpf:req.params.cpf}, {'permanenciaTotal':newPerm}, (err, upObejctInt) =>{
								if(err){
									console.log('------------------------------------');
									console.log(`Third Promise Internal error updating after Calculating ${newPerm} ${err}`);
									console.log('------------------------------------');
								} else {
									res.redirect(`/paginadobolsista/${upObejctInt._id}`);
								}
							});
						}

					});
				}
			});
	} catch(error) {
		console.log('------------------------------------');
		console.log(`Exit Promise External error updating ${error}`);
		console.log('------------------------------------');
	}
});

app.put('/editdeclaracao/:cpf', async (req, res) => {
	try{
		Bolsista.updateOne({cpf:req.params.cpf, 'declaracao._id':req.body.bolsista.declaId},
		{$set: {'declaracao.$.municipioEscola.uf':req.body.bolsista.EditUfDecl,
				'declaracao.$.municipioEscola.nome':req.body.bolsista.editMunDecl,
				'declaracao.$.permanencia':parseInt(req.body.bolsista.editPerm, 10),
				'declaracao.$.regular':req.body.bolsista.editRegDecl,
				'declaracao.$.obsv':req.body.bolsista.editObsvDecl,
				'declaracao.$.user':'user',
				'declaracao.$.data':new Date(),
			}
		},
		(err, foundBol) => {
			if(err){
				console.log(`Internal Error updating declaracao ${req.body.bolsista.declaId}: ${err}`);
			} else{
				Bolsista.findOne({cpf:req.params.cpf}, async (err, foundBol) => {
					if(err){
						console.log('------------------------------------');
						console.log(`Second Promise Internal error finding bolsista ${err}`)
						console.log('------------------------------------');
					} else{
						console.log(foundBol.declaracao)
						var newPerm = await tools.calcPerm(foundBol.declaracao);
						console.log(`newPerm: ${newPerm}`);
						Bolsista.findOneAndUpdate({cpf:req.params.cpf}, {'permanenciaTotal':newPerm}, (err, upObejctInt) =>{
							if(err){
								console.log('------------------------------------');
								console.log(`Third Promise Internal error updating after Calculating ${newPerm} ${err}`);
								console.log('------------------------------------');
							} else {
								res.redirect(`/paginadobolsista/${upObejctInt._id}`);
							}
						});
					}
				});
			}
		})
	} catch(error){
		console.log(`Internal Error updating declaracao ${req.body.bolsista.declaId}: ${err}`);
	}
});

	//Routes order matters! This should always be the last route!!
app.get('*', async (req, res) =>{
	console.log('Waiting...');
	try{
		res.status(200).send("Sorry, We don't have any content here... yet :)");
		console.log('App status: nominal.');
	} catch(error){
		console.log(error);
	}
});

//Server Activation
app.listen(port, hostname, (req, res) => {
    console.log(`Server running at http://${hostname}:${port}/`);
});