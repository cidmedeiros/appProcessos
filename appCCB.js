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

	//SHOW ROUTE
app.get('/paginadobolsista/:id', async (req, res) => {
	try{
		await Bolsista.findById(req.params.id).populate('pags.iesLocal').populate([
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
								console.log('End of server execution!');
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
			await Bolsista.findOne({cpf:input[1]}).populate('pags.iesLocal').populate([
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
					console.log(`Bolsista ${input[1]} not found! ${err}`);
				} else {
					await Ies.find({}, async (err, entidades) =>{
						if(err){
							console.log(`Error fetching Ies collection in CPF -> ${err}`)
						} else {
							await Municipio.find({}, async (err, municipios) => {
								if(err){
									console.log(`Error fetching Municipios collection in CPF -> ${err}`)
								} else{
									res.render('showBolsista', {bolCons:foundBol, entidades:entidades, municipios:municipios});
								}
							})						
						}
					});
				}
			});
		} else if(input[0] === 'sei'){
			await Bolsista.findOne({sei:input[1]}).populate('pags.iesLocal').populate([
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
					console.log(`Error tryng to find ${input[1]}, ${err}`);
				} else {
					await Ies.find({}, async (err, entidades) =>{
						if(err){
							console.log(`Error fetching Ies collection in SEI -> ${err}`)
						} else {
							await Municipio.find({}, async (err, municipios) => {
								if(err){
									console.log(`Error fetching Municipios collection in SEI -> ${err}`)
								} else{
									res.render('showBolsista', {bolCons:foundBol, entidades:entidades, municipios:municipios});
								}
							})						
						}
					});
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
						console.log('--------------------------------');
						console.log('Is this getting executed?');
						console.log('--------------------------------');
						async () => {
							await Bolsista.findOne({nome:foundBol}).populate('pags.iesLocal').populate([
								{
									path: 'pags.programa',
									model:'Programa',
									populate:{
										path:'coordNacional.ies',
										model:'Ies'
									}
								}
							]).exec(async (err, foundOne) => {
								if(err){
									console.log(`Bolsista ${input[1]} not found! ${err}`)
								} else {
									await Ies.find({}, async (err, entidades) =>{
										if(err){
											console.log(`Error fetching Ies collection in NOME -> ${err}`)
										} else {
											await Municipio.find({}, async (err, municipios) => {
												if(err){
													console.log(`Error fetching Municipios collection in NOME -> ${err}`)
												} else{
													res.render('showBolsista', {bolCons:foundBol, entidades:entidades, municipios:municipios});
												}
											})						
										}
									});									
								}
							});
						}
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

	//PUT ROUTE (UPDATE ROUTE)
app.put('/editardadospessoais/:cpf', async (req, res) => {
	try{
		await Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{'email':{'email':req.body.bolsista.email, 'data': new Date()}},
				'sexo': req.body.bolsista.sexo
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					console.log(`-------------------------------`);
				}
		});
	} catch {
		console.log('Error updating email/sexo');
	}
	try{
		await Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{'$push':
				{'docFoto':
					{
						'doc': req.body.bolsista.tipoDocFoto,
						'regular':req.body.bolsista.regDocFoto,
						'obsv':req.body.bolsista.obsvDocFoto,
						'data': new Date(),
						'user':'tester'
					}
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					console.log('-------------------------------------------');
				}
		});
	} catch {
		console.log('Error updating docFoto');
	}
	try{
		await Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{'$push':
				{'docRes':
					{
						'doc': req.body.bolsista.tipoDocRes,
						'regular':req.body.bolsista.regDocRes,
						'obsv':req.body.bolsista.obsvDocRes,
						'data': new Date(),
						'user':'tester'
					}
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					console.log('-------------------------------------------');
				}
		});
	} catch {
		console.log('Error updating docRes');
	}
	try{
		await Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{'$push':
				{'termo':
					{
						'regular':req.body.bolsista.regTermo,
						'obsv':req.body.bolsista.obsvTermo,
						'data': new Date(),
						'user':'tester'
					}
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					console.log('-------------------------------------------');
					res.redirect(`/paginadobolsista/${upObejct._id}`);
				}
		});
	} catch {
		console.log('Error updating Termo');
	}

});

app.put('/editarcompromisso/:cpf', async (req, res) =>{
	try{
		await Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{'email':{'email':req.body.bolsista.email, 'data': new Date()}},
				'sexo': req.body.bolsista.sexo
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					console.log(`-------------------------------`);
				}
		});
	} catch {
		console.log('Error updating email/sexo');
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