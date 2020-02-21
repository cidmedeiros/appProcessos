var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');

router.get('/relatoriositgeral', middleware.isLoggedIn, async (req, res) => {
    try{
        Bolsista.aggregate([
             {$set:
                {
                    lastAnalise: {$arrayElemAt:['$analiseCompromisso', -1]},
                    lastTermo: {$arrayElemAt:['$termo', -1]},
                    lastStatus: {$arrayElemAt:['$statusCurso', -1]},
                    permanencia: {$cond:[{$gte:['$permanenciaTotal', 60]}, 'Ao menos 60 meses', {$cond:[{$eq:['$permanenciaTotal', 0]},'Sem Permanência','Menos que 60 meses']}]}
                }
            },
             {$group:
                {
                 _id:{regularidadeAnalise:'$lastAnalise.regular', obsvAnalise:'$lastAnalise.obsv',
                      regularidadeTermo:'$lastTermo.regular', obsvTermo:'$lastTermo.obsv',
                      statusCurso: '$lastStatus.status',
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
                qtdeBolsistas: -1
                }
            }
        ]).then((ans) => {
            res.render('relSitGeral', {dados:ans});
        });
    } catch(error) {
        console.log(`Error in catch statement: ${error}`);
    }
});

module.exports = router;