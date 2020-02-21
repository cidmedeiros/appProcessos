var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Ies = require('../models/ies');
var Bolsista = require('../models/bolsistas');

router.put('/editarcompromisso/:cpf', middleware.isLoggedIn, async (req, res) =>{
	//Ies
	try{
		var iesUpdate;
		await Ies.findOne({sigla:req.body.bolsista.iesCert}, async (err, foundIes) => {
			if(err){
				console.log('------------------------------------');
				console.log(`First Promise Internal error finding Ies ${err}`)
				console.log('------------------------------------');
			} else{
				iesUpdate = foundIes._id;
			}
		});
	} catch(error){
		console.log('------------------------------------');
		console.log(`First Promise External error finding Ies ${error}`);
		console.log('------------------------------------');
	}
	//Push Docs
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{

					'statusCurso':{status:req.body.bolsista.status, data: new Date(req.body.bolsista.dataConcl), user:req.body.user},
					'certConclusao':{ies:iesUpdate,regular:req.body.bolsista.regCert,obsv:req.body.bolsista.obsvCert, user:req.body.user, data: new Date()},
					'analiseCompromisso':{regular:req.body.bolsista.resAna,obsv:req.body.bolsista.obsvAna, user:req.body.user, data: new Date()}
				}
			},
			(err, upObejct) =>{
				if(err){
					console.log('------------------------------------');
					console.log(`First Promise Internal error updating ${err}`);
					console.log('------------------------------------');
				} else{
					res.redirect(`/paginadobolsista/${upObejct._id}`);
				}
			});
	} catch(error) {
		console.log('------------------------------------');
		console.log(`Exit Promise External error updating ${error}`);
		console.log('------------------------------------');
	}
});

module.exports = router;