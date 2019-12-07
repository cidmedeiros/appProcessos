//Required External Modules
path = require("path");
express = require('express');
http = require("http");
bodyParser = require('body-parser');
mongoose = require('mongoose');
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
	tools.formatNumber(input);
	res.render('showBolsista', {bolCons:input[1]});
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
				res.render('showBolsista', {outBolsista:foundBol});
				console.log('data sent to template');
			}
		});
	} catch(error) {
		console.log('Error retrieving data', error);
	}
});

//EDIT ROUTE
app.get('/bolsista/:id/edit', async (req, res) => {
	//retrieve bolsista with provided ID
	try{
		await Bolsista.findById(req.params.id, (err, foundBol) => {
			if(err){
				console.log('Error retrieving edit data', error);		
			} else {
				console.log(`${foundBol} has just been retrieved for edit`);
				res.render('infoEdit', {outBolsista:foundBol});
				console.log('data sent to edit template');
			}
		})
	} catch(error){
		console.log('Error retrieving edit data', error);
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