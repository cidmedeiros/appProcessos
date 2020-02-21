var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');
var Ies = require('../models/ies');
var Municipio = require('../models/municipios');

router.get('/paginadobolsista/:id',middleware.isLoggedIn, async (req, res) => {
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

module.exports = router;