var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');

router.post('/clbrbolsistas', middleware.isLoggedIn, async(req, res) =>{
	res.redirect(`/clbrbolsistas/${req.body.clbrselect}`);
});

router.get('/clbrbolsistas/:id', middleware.isLoggedIn, async(req, res) =>{
	try{
		Bolsista.find({'clbr.idClbr':req.params.id}).populate('pags.iesLocal').populate('certConclusao.ies')
		.populate([
			{
				path: 'pags.programa',
				model:'Programa',
				populate:{
					path:'coordNacional.ies',
					model:'Ies'
				}
			}
		]).exec((err, allBols) => {
			if(err){
				res.render('noClbr');
			} else if (allBols.length == 0){
				res.render('noClbr');
			} else {
				res.render('showBolsistas', {allBols:allBols});
			}
		})
	} catch(error){
		res.render('noClbr');
	}
});

module.exports = router;