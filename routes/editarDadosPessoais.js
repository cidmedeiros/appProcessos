var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');

router.put('/editardadospessoais/:cpf', middleware.isLoggedIn, (req, res) => {
	try{
		Bolsista.findOneAndUpdate({cpf:req.params.cpf},
			{
				'$push':{'email':{'email':req.body.bolsista.email, 'data': new Date()},
						'docFoto':{'doc': req.body.bolsista.tipoDocFoto,'regular':req.body.bolsista.regDocFoto,'obsv':req.body.bolsista.obsvDocFoto,'data': new Date(),'user':req.body.user},
						'docRes':{'doc': req.body.bolsista.tipoDocRes,'regular':req.body.bolsista.regDocRes,'obsv':req.body.bolsista.obsvDocRes,'data': new Date(),'user':req.body.user},
						'termo':{'regular':req.body.bolsista.regTermo,'obsv':req.body.bolsista.obsvTermo,'data': new Date(),'user':req.body.user}},
				'sexo': req.body.bolsista.sexo
			},
			(err, upObejct) =>{
				if(err){
					console.log(err);
				} else{
					res.redirect(`/paginadobolsista/${upObejct._id}`);
				}
		});
	} catch {
		console.log('Error updating email/sexo');
	}
});

module.exports = router;