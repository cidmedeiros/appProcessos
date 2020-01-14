var express, app, bodyParser, mongoose

express = require('express');
app = express();
app.listen(3000, function(req, res){
    console.log('The Server Has Started!');
});

bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bolsistas', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

/* Schema SetUp */
var bolsista = new mongoose.Schema({
	cpf: String,
	nome: String,
	sexo: String,
	colaborador: String
});

var Bolsista = mongoose.model('Bolsista', bolsista);

/* creates new camps */

/* Campground.create(
	{
		name:name,
		image: image
	}, function(err, camp){
		if(err){
			console.log(err);
		} else {
			console.log('Another camp added to the Universe!');
			console.log(camp);
		}
}); */

app.get('/', function(req, res){
    res.render('index.ejs');
});

/* app.get('/campgrounds', function(req, res){
	//Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log('Something Wrong with MongoDB');
			console.log(err);
		} else {
			res.render('index.ejs', {campgrounds:allCampgrounds});
		}
	});
});

app.post('/campgrounds', function(req, res){
	//get data from the form and add it to campgrounds array
	var new_name = req.body.camp;
	var image_url = req.body.image;
	var newCamp = {name: new_name, image:image_url}
	Campground.create(newCamp, function(err, newCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect('/campgrounds');
		}
	});
});

app.get('/campgrounds/new', function(req, res){
	res.render('new.ejs');
});

app.get('/campgrounds/:id', function(req, res){
	//find the camp with the provided ID
	Campground.findById(req.params.id, function(err, foundcamp){
		if(err){
			console.log(err);
		} else {
			res.render('show.ejs', {camp:foundcamp});
		}

	});
}); */