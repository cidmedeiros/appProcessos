var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');
var Ies = require('../models/ies');
var User = require('../models/user');
var util = require('util');

router.post('/consultabolsistaeditarsei', middleware.isLoggedIn, async (req, res) => {
	let input = req.body.consulta;
	input = await tools.treatInput(input);
	try{
		if(input[0] === 'cpf'){
			await Bolsista.findOne({cpf:input[1]}).populate('pags.iesLocal').populate('clbr.user').
			exec(async (err, foundBol) => {
				if(err){
					console.log(`Bolsista ${input[1]} not found! Error: ${err}`);
					res.render('bolsistaNaoEncontrado');
				} else {
					let ans = [];
					let lastIes = foundBol.pags[foundBol.pags.length-1].iesLocal.sigla;
					let colaborador = foundBol.clbr[foundBol.clbr.length-1].user.fullname;
					let seiHist = foundBol.seiHist.length > 0 ? foundBol.seiHist[foundBol.seiHist.length-1] : {'seiAtual': foundBol.sei, 'user': 'Default', data:'Default'}

					ans.push({'ies':lastIes,'cpf':foundBol.cpf, 'sei':foundBol.sei, 'seiHist':seiHist,
					'nome':foundBol.nome, 'colaborador': colaborador, 'id':foundBol._id})
					//console.log(util.inspect(ans, false, null, true /* enable colors */));
					res.render('editaSei', {bolsistas:ans});
				}
			});
		} else if(input[0] === 'sei'){
			await Bolsista.findOne({sei:input[1]}).populate('pags.iesLocal').populate('clbr.user').
			exec(async (err, foundBol) => {
				if(err){
					res.render('bolsistaNaoEncontrado');
					console.log(`Bolsista ${input[1]} not found! Error: ${err}`);
				} else {
					let ans = [];
					let lastIes = foundBol.pags[foundBol.pags.length-1].iesLocal.sigla;
					let colaborador = foundBol.clbr[foundBol.clbr.length-1].user.fullname;
					let seiHist = foundBol.seiHist.length > 0 ? foundBol.seiHist[foundBol.seiHist.length-1] : {'seiAtual': foundBol.sei, 'user': 'Default', data:'Default'}

					ans.push({'ies':lastIes,'cpf':foundBol.cpf, 'sei':foundBol.sei, 'seiHist':seiHist,
					'nome':foundBol.nome, 'colaborador': colaborador, 'id':foundBol._id})
					//console.log(util.inspect(ans, false, null, true /* enable colors */));
					res.render('editaSei', {bolsistas:ans});
				}
			});
		} else if(input[0] === 'nome'){
			let nome = input[1].split(' ');
			await Bolsista.fuzzySearch({query: input[1], minSize: nome[0].length}, (error, ans) =>{
				if(!error){
					if(ans.length == 0){
						res.render('bolsistaNaoEncontrado');
					} else {
						Ies.populate(ans, {path:'pags.iesLocal'}, async (error, ans) => {
							if(!error){
								await User.populate(ans, {path:'clbr.user'}, (error, ans) => {
									if(!error){
										if(ans[0].nome == input[1] || ans.length == 1){
											let foundBols = [];
											let lastIes = ans[0].pags[ans[0].pags.length-1].iesLocal.sigla;
											let colaborador = ans[0].clbr[ans[0].clbr.length-1].user.fullname;
											let seiHist = ans[0].seiHist.length > 0 ? ans[0].seiHist[ans[0].seiHist.length-1] : {'seiAtual': ans[0].sei, 'user': 'Default', data:'Default'}
											
											foundBols.push({'ies':lastIes,'cpf':ans[0].cpf, 'sei':ans[0].sei, 'seiHist':seiHist,'nome':ans[0].nome, 'colaborador': colaborador, 'id':ans[0]._id})

											//console.log(util.inspect(foundBols, false, null, true /* enable colors */));
											res.render('editaSei', {bolsistas:foundBols});
										} else {
											let threshold = 7
											if(ans.length > threshold){
												let foundBols = [];
												for(var i = 0; i < threshold; i++){
													let lastIes = ans[i].pags[ans[i].pags.length-1].iesLocal.sigla;
													let colaborador = ans[i].clbr[ans[i].clbr.length-1].user.fullname;
													let seiHist = ans[i].seiHist.length > 0 ? ans[i].seiHist[ans[i].seiHist.length-1] : {'seiAtual': ans[i].sei, 'user': 'Default', data:'Default'}
													
													foundBols.push({'ies':lastIes,'cpf':ans[i].cpf, 'sei':ans[i].sei, 'seiHist':seiHist,'nome':ans[i].nome, 'colaborador': colaborador, 'id':ans[i]._id})
												}
												//console.log(util.inspect(foundBols, false, null, true /* enable colors */));
												res.render('editaSei', {bolsistas:foundBols});
											} else {
												let foundBols = [];
												for(var i = 0; i < ans.length; i++){
													let lastIes = ans[i].pags[ans[i].pags.length-1].iesLocal.sigla;
													let colaborador = ans[i].clbr[ans[i].clbr.length-1].user.fullname;
													let seiHist = ans[i].seiHist.length > 0 ? ans[i].seiHist[ans[i].seiHist.length-1] : {'seiAtual': ans[i].sei, 'user': 'Default', data:'Default'}
													
													foundBols.push({'ies':lastIes,'cpf':ans[i].cpf, 'sei':ans[i].sei, 'seiHist':seiHist,'nome':ans[i].nome, 'colaborador': colaborador, 'id':ans[i]._id})
												}
												//console.log(util.inspect(foundBols, false, null, true /* enable colors */));
												res.render('editaSei', {bolsistas:foundBols});
											}
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