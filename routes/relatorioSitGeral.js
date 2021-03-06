var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');
util = require('util');

router.get('/relatoriositgeral', middleware.isLoggedIn, async (req, res) => {
    try{
        Bolsista.aggregate([
             {$set:
                {
                    lastAnalise: {$arrayElemAt:['$analiseCompromisso', -1]},
                    lastTermo: {$arrayElemAt:['$termo', -1]},
                    lastStatus: {$arrayElemAt:['$statusCurso', -1]},
                    permanencia: {$cond:[{$gte:['$permanenciaTotal', 60]}, 'Ao menos 60 meses', {$cond:[{$eq:['$permanenciaTotal', 0]},'Sem PermanĂȘncia','Menos que 60 meses']}]}
                }
            },
             {$group:
                {
                 _id:{
                     regularidadeAnalise:'$lastAnalise.regular', obsvAnalise:'$lastAnalise.obsv',
                      regularidadeTermo:'$lastTermo.regular', statusCurso: '$lastStatus.status',
                      permanencia: '$permanencia'
                    },
                 bolsistas: {$addToSet: '$_id'}
                }
            },
             {$set: {
                qtdeBolsistas: {$size:'$bolsistas'}
                }
            },
            {$sort: {
                qtdeBolsistas: -1, '_id.statusCurso': 1, '_id.permanencia': 1, '_id.regularidadeTermo': 1, '_id.regularidadeAnalise': 1
                }
            }
        ]).then((ans) => {
            //console.log(util.inspect(ans, false, null, true /* enable colors */));
            res.render('showRelSitGeral', {dados:ans});
        });
    } catch(error) {
        console.log(`Error in catch statement: ${error}`);
    }
});

module.exports = router;