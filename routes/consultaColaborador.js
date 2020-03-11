var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');
ObjectId = require('mongodb').ObjectID;

router.post('/clbrbolsistas', middleware.isLoggedIn, async(req, res) =>{
	res.redirect(`/clbrbolsistas/${req.body.clbrselect}`);
});

router.get('/clbrbolsistas/:id', middleware.isLoggedIn, async(req, res) =>{
	try{
		Bolsista.find({$expr : {$eq : [{"$arrayElemAt": ["$clbr.user", -1]},  mongoose.Types.ObjectId(req.params.id)]}}).sort({nome: 1}).populate('pags.iesLocal').populate('certConclusao.ies').populate('clbr.user')
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
				console.log({'Server error':err});
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