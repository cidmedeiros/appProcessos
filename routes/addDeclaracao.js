var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');

router.put('/adddeclaracao/:cpf', middleware.isLoggedIn, async (req, res) =>{
	//Push Declaracao
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{
					'declaracao':{municipioEscola:{nome:req.body.bolsista.munDecl, uf:req.body.bolsista.ufDecl}, permanencia:parseInt(req.body.bolsista.perm, 10), regular:req.body.bolsista.regDecl, obsv:req.body.bolsista.obsvDecl, user:req.body.user, data: new Date()},
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log(`First Promise Internal error updating ${err}`);
				} else{
					Bolsista.findOne({cpf:req.params.cpf}, async (err, foundBol) => {
						if(err){
							console.log(`Second Promise Internal error finding bolsista ${err}`)
						} else{
							var newPerm = await tools.calcPerm(foundBol.declaracao);
							Bolsista.findOneAndUpdate({cpf:req.params.cpf}, {'permanenciaTotal':newPerm}, (err, upObejctInt) =>{
								if(err){
									console.log(`Third Promise Internal error updating after Calculating ${newPerm} ${err}`);
								} else {
									res.redirect(`/paginadobolsista/${upObejctInt._id}`);
								}
							});
						}
					});
				}
			});
	} catch(error) {
		console.log(`Exit Promise External error updating ${error}`);
	}
});

module.exports = router;