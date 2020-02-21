var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');

router.post('/consultabolsista', middleware.isLoggedIn, async (req, res) => {
	let input = req.body.consulta;
	input = await tools.treatInput(input);
	try{
		if(input[0] === 'cpf'){
			await Bolsista.findOne({cpf:input[1]}, async (err, foundBol) => {
				if(err | !foundBol){
					console.log(`Bolsista ${input[1]} not found! ${err}`);
					res.render('bolsistaNaoEncontrado');
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'sei'){
			await Bolsista.findOne({sei:input[1]}, async (err, foundBol) => {
				if(err | !foundBol){
					console.log(`Error tryng to find ${input[1]}, ${err}`);
					res.render('bolsistaNaoEncontrado');
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'nome'){
			res.render('pesquisaPorNome');
		} else {
			res.render('bolsistaNaoEncontrado');
		}
	} catch(error){
		console.log(`Error trying to find ${input[1]}, ${error} by catch`);
		res.render('bolsistaNaoEncontrado');
	}
});

module.exports = router;