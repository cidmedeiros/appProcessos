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
mongoose.connect('mongodb://localhost:27017/bolsistas', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const bolsista = new mongoose.Schema({
	cpf: String,
	nome: String,
	sexo: String,
	colaborador: String
});

const Bolsista = mongoose.model('Bolsista', bolsista);

//Routes Definitions
async function wait (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  });
}

app.get('/', async (req, res) =>{
	console.log('Waiting...');
	try{
		await wait(1000);
		res.status(200).render('landing.ejs');
		console.log('Operating ok...');
	} catch(error){
		alert(error);
	}
});

app.post('/savegrantee', async (req, res) =>{
	console.log('Saving...');
	const bolsista = {}
	try{
		await wait(1000);
		bolsista.cpf = req.body.cpf;
		bolsista.nome = req.body.nome;
		bolsista.sexo = req.body.sexo;
		bolsista.colaborador= req.body.clbr;
	} catch(error){
		alert('The data was not sent! Try Again.', error);
	}
	console.log(bolsista);
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


