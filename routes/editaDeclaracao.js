var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');

router.put('/editdeclaracao/:cpf', middleware.isLoggedIn, async (req, res) => {
	try{
		Bolsista.updateOne({cpf:req.params.cpf, 'declaracao._id':req.body.bolsista.declaId},
		{$set: {'declaracao.$.municipioEscola.uf':req.body.bolsista.EditUfDecl,
				'declaracao.$.municipioEscola.nome':req.body.bolsista.editMunDecl,
				'declaracao.$.permanencia':parseInt(req.body.bolsista.editPerm, 10),
				'declaracao.$.regular':req.body.bolsista.editRegDecl,
				'declaracao.$.obsv':req.body.bolsista.editObsvDecl,
				'declaracao.$.user':req.body.user,
				'declaracao.$.data':new Date(),
			}
		},
		(err, result) => {
			if(err){
				console.log(`Internal Error updating declaracao ${req.body.bolsista.declaId}: ${err}`);
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
		})
	} catch(error){
		console.log(`Internal Error updating declaracao ${req.body.bolsista.declaId}: ${err}`);
	}
});

module.exports = router;