var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');
var Ies = require('../models/ies');
util = require('util');

router.get('/relatoriopendenciasies', middleware.isLoggedIn, async (req, res) => {
    Bolsista.aggregate([
        {$match:
            {termo : {$exists:true, $not:{$size: 0}}}
        },
        {$set:
            {
                lastTermo: {$arrayElemAt: ['$termo', -1]},
                curso: {$arrayElemAt: ['$statusCurso', -1]},
                lastPag: {$arrayElemAt: ['$pags', -1]},
                lastEmail: {$arrayElemAt: ['$email', -1]},
                lastClbr: {$arrayElemAt: ['$clbr', -1]}
            }
        },
        {$match:
            //$expr can build query expressions that compare fields from the same document in a $match stage.
            {$expr : {$or:[{$eq:['$curso.status','Pendente de Informação']}, {$eq : ['$lastTermo.regular','Irregular']}]}}
        },
        {$set:
            {
                iesLocal:'$lastPag.iesLocal',
                user:'$lastClbr.user'
            }
        },
        {$project:
            {iesLocal:1,sei:1,cpf:1,nome:1,lastEmail:1,user:1,curso:1,lastTermo:1}
        },
        {$group:
            {
                _id: {
                    ies:'$iesLocal'
                },
                bolsistas: {$addToSet: '$_id'}
            }
        },
        {$set:
            {qtde: {$size:'$bolsistas'}}
        },
        {$sort:
            {qtde:-1, '_id.ies':1}
        }
    ], (err, ans) => {
        if(!err){
            Ies.populate(ans, {path:'_id.ies'}, (err, ansPop) =>{
                if(!err){
                    res.render('showPendenciasIes', {dados:ansPop});
                } else{
                    console.log(err);
                    res.render('bolsistaNaoEncontrado');        
                }
            });
        } else {
            console.log(err);
            res.render('bolsistaNaoEncontrado');
        }
    });
});

module.exports = router;