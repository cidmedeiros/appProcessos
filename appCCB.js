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
			]).exec((err, foundBol) => {
				if(err){
					console.log(`Bolsista ${input[1]} not found! ${err}`)
				} else {
					res.render('showBolsista', {bolCons:foundBol});
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
			]).exec((err, foundBol) => {
				if(err){
					console.log(`Error tryng to find ${input[1]}, ${err}`)
				} else {
					console.log(foundBol._id)
					res.render('showBolsista', {bolCons:foundBol});
				}
			});
		} else if(input[0] === 'nome'){
			await Bolsista.fuzzySearch({nome:input[1]}, (err, foundBol) => {
				if(err){
					console.log(`Error tryng to find ${input[1]}, ${err}`)
				} else {
					if(foundBol.lenght === 1){
						let foundCpf = foundBol[0]['cpf'];
						async () => {
							await Bolsista.findOne({cpf:foundCpf}).populate('pags.iesLocal').populate([
								{
									path: 'pags.programa',
									model:'Programa',
									populate:{
										path:'coordNacional.ies',
										model:'Ies'
									}
								}
							]).exec((err, foundOne) => {
								if(err){
									console.log(`Bolsista ${input[1]} not found! ${err}`)
								} else {
									console.log(foundOne.pags);
									res.render('showBolsista', {bolCons:foundOne});
								}
							});
						}
					} else {
						res.render('showResultados', {bolCons:foundBol});
						console.log(foundBol);
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
app.put('/bolsista/:id', async (req, res) => {
	try{
		await Bolsista.findByIdAndUpdate(req.params.id, req.body.outBolsista, (err, foundBol) => {
			if(err){
				console.log('Error retrieving update data', err);
				res.redirect(`/bolsista/:${req.params.id}/edit`);
			} else {
				console.log('Data Saved',foundBol,req.body.outBolsista);
				res.redirect('/');
			}
		});
	} catch(error) {
		console.log('Error retrieving update data', error);
	}
});

//CREATE ROUTE - Save Data into DB
app.post('/', async (req, res) =>{
	console.log('Saving...');
	try{
		await Bolsista.create(req.body.outBolsista, (err, bols) => {
			if(err){
				console.log('Not Saved!', err);
			} else{
				console.log(`${bols} has just been saved`);
				res.redirect('/');
			}
	});
	} catch(error){
		console.log('The data was not sent! Try Again.', error);
	}
});



app.delete('/bolsista/:id', async (req, res) => {
	try{
		await Bolsista.findByIdAndDelete(req.params.id, (err) =>{
			if(err){
				console.log('Error trying to delete', err);
			} else {
				console.log('Data deleted')
				res.redirect('/');
			}
		});
	} catch(error){
		console.log('Error trying to delete');
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