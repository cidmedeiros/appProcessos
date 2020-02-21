var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var tools = require('../assets/scripts/tools');
var Bolsista = require('../models/bolsistas');

router.delete('/deletedeclaracao/:cpf/:id', middleware.isLoggedIn, async (req, res) => {
	try{
		Bolsista.updateOne({cpf:req.params.cpf},{$pull: {declaracao:{_id:req.params.id}}}, (err, result) => {
			if(err){
				console.log(`First promise Internal Error deleting declaracao ${req.params.id}: ${err}`);
			} else{
				Bolsista.findOne({cpf:req.params.cpf}, async (err, foundBol) => {
					if(err){
						console.log('------------------------------------');
						console.log(`Second Promise Internal error finding bolsista ${err}`)
						console.log('------------------------------------');
					} else{
						var newPerm = await tools.calcPerm(foundBol.declaracao);
						Bolsista.findOneAndUpdate({cpf:req.params.cpf}, {'permanenciaTotal':newPerm}, (err, upObejctInt) =>{
							if(err){
								console.log('------------------------------------');
								console.log(`Third Promise Internal error updating after Calculating ${newPerm} ${err}`);
								console.log('------------------------------------');
							} else {
								res.redirect(`/paginadobolsista/${upObejctInt._id}`);
							}
						});
					}
				});
			}
		})
	} catch(error){
		console.log(`Internal Error deleting declaracao ${req.body.bolsista.declaId}: ${err}`);
	}
});

module.exports = router;