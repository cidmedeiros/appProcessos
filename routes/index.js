var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Bolsista = require('../models/bolsistas');
var middleware = require('../middleware/middleware');

//AUTH ROUTES
router.get('/registro', (req, res) =>{
	res.render('./acesso/register');
});

router.post('/registro',  async (req, res) =>{
	try{
		let fullName = req.body.fullname.toUpperCase();
		User.register( new User({fullname:fullName, username:req.body.username, lotacao:req.body.lotacao}), req.body.password, (err, user) =>{
			if(err){
				console.log(`External error trying to register user ${err}`);
			} else {
				passport.authenticate('local')(req, res, ()=>{
					res.redirect('/login');
				});
			}
		});
	} catch(error){
		console.log(`External error trying to register user ${error}`)
	}
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}), (req, res) =>{});

router.get('/logout', (req, res) =>{
	req.logout();
	res.redirect('/login');
});

	//INDEX ROUTE
router.get('/', middleware.isLoggedIn, async (req, res) =>{
	try{
		Bolsista.find({}, (err, allBols) => {
			if(err){
				console.log(`Internal error: ${err}`);
			} else {
				var clbrsIds = [];
				var clbrs = [];
				allBols.forEach(bol => {
					let indx = (bol.clbr.length)-1;
					lastClbr = bol.clbr[indx];
					if(!clbrsIds.includes(lastClbr.idClbr)){
						clbrsIds.push(lastClbr.idClbr);
						clbrs.push(lastClbr);
					}
				});
				res.render('landing', {clbrs:clbrs})
			}
		});
	}catch(error){
		console.log(`External error: ${error}`);
	}
});

module.exports = router;