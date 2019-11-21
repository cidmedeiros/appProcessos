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
const bolsista = mongoose.model('bolsista', bolsistaSchema);

async function getBolsistas(){
	bolsista.find({}, (err, bolss) => {
		if(err){
			alert('Error retrieving data from Mongo', err);
		}else{
			console.log('data loaded');
			console.log(bolss);
			return bolss;
		}
	});
};

//Routes Definitions
const todosBolsistas = getBolsistas();

async function wait (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  });
}

app.get('/', async (req, res) =>{
	console.log('Waiting...');
	try{
		await wait(5);
		res.status(200).render('landing.ejs',{bolsistas:todosBolsistas});
		console.log('Operating ok...');
	} catch(error){
		alert(error);
	}
});

app.post('/', async (req, res) =>{
	console.log('Saving...');
	try{
		await wait(500);
		const bolsista_local = new bolsista({
			cpf:req.body.cpf,
			nome:req.body.nome,
			sexo:req.body.sexo,
			colaborador:req.body.clbr
		});
	} catch(error){
		alert('The data was not sent! Try Again.', error);
	}
	bolsista_local.save((err, bols) => {
		if(err){
			alert('Not Saved!', err);
		} else{
			console.log(`${bols} has just been saved`)
		}
	});
	res.redirect('/');
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
		alert(error);
	}
});

//Server Activation
app.listen(port, hostname, (req, res) => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


