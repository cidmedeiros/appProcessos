var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');
var Ies = require('../models/ies');
var User = require('../models/user');
var util = require('util');

router.post('/consultabolsista', middleware.isLoggedIn, async (req, res) => {
	let input = req.body.consulta;
	input = await tools.treatInput(input);
	try{
		if(input[0] === 'cpf'){
			await Bolsista.findOne({cpf:input[1]}, async (err, foundBol) => {
				if(err | !foundBol){
					res.render('bolsistaNaoEncontrado');
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'sei'){
			await Bolsista.findOne({sei:input[1]}, async (err, foundBol) => {
				if(err | !foundBol){
					res.render('bolsistaNaoEncontrado');
				} else {
					res.redirect(`/paginadobolsista/${foundBol._id}`);
				}
			});
		} else if(input[0] === 'nome'){
			let nome = input[1].split(' ');
			await Bolsista.fuzzySearch({query: input[1], minSize: nome[0].length}, (error, ans) =>{
				if(!error){
					if(ans.length == 0){
						res.render('bolsistaNaoEncontrado');
					} else if(ans[0].nome == input[1] || ans.length == 1){
						res.redirect(`/paginadobolsista/${ans[0]._id}`);
					} else {
						Ies.populate(ans, {path:'pags.iesLocal'}, (error, ans) => {
							if(!error){
								User.populate(ans, {path:'clbr.user'}, (error, ans) => {
									if(!error){
										let threshold = 7
										if(ans.length > threshold){
											let foundBols = [];
											for(var i = 0; i < threshold; i++){
												let lastIes = ans[i].pags[ans[i].pags.length-1].iesLocal.sigla;
												let colaborador = ans[i].clbr[ans[i].clbr.length-1].user.fullname;
												foundBols.push({'ies':lastIes,'cpf':ans[i].cpf, 'sei':ans[i].sei, 'nome':ans[i].nome, 'colaborador': colaborador, 'id':ans[i]._id})
											}
											//console.log(util.inspect(foundBols, false, null, true /* enable colors */));
											res.render('pesquisaPorNome', {bolsistas:foundBols});
										} else {
											let foundBols = [];
											for(var i = 0; i < ans.length; i++){																			let lastIes = ans[i].pags[ans[i].pags.length-1].iesLocal.sigla;
												let colaborador = ans[i].clbr[ans[i].clbr.length-1].user.fullname;
												foundBols.push({'ies':lastIes,'cpf':ans[i].cpf, 'sei':ans[i].sei, 'nome':ans[i].nome, 'colaborador': colaborador, 'id':ans[i]._id})
											}
											//console.log(util.inspect(foundBols, false, null, true /* enable colors */));
											res.render('pesquisaPorNome', {bolsistas:foundBols});
										}
									} else {
										console.log({'Error populating colaborador': error});
									}
								});
							} else {
								console.log({'Error populating ies': error});
							}
						});
					}
				} else {
					console.log({'Error name search':error});
				}
			});
		} else {
			res.render('bolsistaNaoEncontrado');
		}
	} catch(error){
		console.log(`Error trying to find ${input[1]}, ${error} by catch`);
		res.render('bolsistaNaoEncontrado');
	}
});

module.exports = router;