express = require('express');
router = express.Router();
mongoose = require('mongoose');
middleware = require('../middleware/middleware');
Bolsista = require('../models/bolsistas');
User = require('../models/user');
util = require('util');

router.post('/editasei/:id', middleware.isLoggedIn, async (req, res) => { 
    Bolsista.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id)},
    {
        'sei':req.body.numSei,
        '$push': {'seiHist':{'sei':req.body.numSei, 'data': new Date(), 'user':req.body.userName}}
    },
    (err, upObject) =>{
        if(!err){
            res.redirect(`/paginadobolsista/${req.params.id}`);
        } else {
            callback(500, {'Não foi possível cadastrar processo SEI':err});
        }
    })
});

module.exports = router;