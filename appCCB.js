//Required External Modules
const path = require("path");
const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const tools = require('./assets/scripts/tools')

//App Variable
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));
app.set('view engine', 'ejs');
const hostname = `${tools.getLocalIp()}`;
const port = 8087;

//Set DataBase
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const bolsistaSchema = new mongoose.Schema({
	cpf: String,
	nome: String,
	sexo: String,
	colaborador: String
});

	//the next statement uses the plural form of the string param to create (if needed) a collection on the DB.
const Bolsista = mongoose.model('Bolsista', bolsistaSchema);

	//Asyncronous function to use to teste DataBase performance
async function wait (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  });
}

//Routes Definitions

	//INDEX ROUTE - Lists all the related data from DB
app.get('/', async (req, res) =>{
	console.log('Waiting...');
	try{
		await Bolsista.find({}, (err, todosBolsistas)=> {
			if(err){
				aconsole.log('Error retrieving data', err);
			} else{
				res.render('landing.ejs', {outBolsistas:todosBolsistas});
				console.log('Operating ok...');
			}
		});
	} catch(error){
		console.log('If not the same error => error rendering template',error);
	}
});

	//CREATE ROUTE - Save Data into DB
app.post('/', async (req, res) =>{
	console.log('Saving...');
	const bolsista_local = new Bolsista({
		cpf:req.body.cpf,
		nome:req.body.nome,
		sexo:req.body.sexo,
		colaborador:req.body.clbr});
	try{
		await bolsista_local.save((err, bols) => {
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

	//SHOW ROUTE
app.get('/bolsista/:id', async (req, res) => {
	//find bolsista with provided ID
	try{
		await Bolsista.findById(req.params.id, (err,foundBol) => {
			if(err){
				console.log('Error retrieving data', err);
			} else{
				console.log(`${foundBol} has just been retrieved`);
				res.render('show', {outBolsista:foundBol});
				console.log('data sent to template');
			}
		});
	} catch(error) {
		console.log('Error retrieving data', error);
	}
});

/* 
	//Global pattern for views pages
app.get('/views/:someView', async (req, res) =>{
	console.log('Loading...');
	try{
		await wait(1000);
		const view = req.params.someView;
		res.status(200).send(`Welcome to ${view} page! New content here soon :)`);
		console.log('Operating ok...');
	} catch(error){
		alert(error);
	}
});
 */

	//Routes order matters! This should always be the last route!!
app.get('*', async (req, res) =>{
	console.log('Waiting...');
	try{
		await wait(3 * 1000);
		res.status(200).send("Sorry, We don't have any content here... yet :)");
		console.log('Operating ok...');
	} catch(error){
		console.log(error);
	}
});

//Server Activation
app.listen(port, hostname, (req, res) => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


