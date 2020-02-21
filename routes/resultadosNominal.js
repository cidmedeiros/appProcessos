var express = require('express');
var router = express.Router();
var middleware = require('../middleware/middleware');
var Bolsista = require('../models/bolsistas');

router.post('/resultadosnominal/:id', middleware.isLoggedIn, async (req, res) => {
    let paramRes = req.body.paramRes
    let data = req.body.listaBolsistas;
    var array = data.split(",");
    let objectIdArray = array.map(s => mongoose.Types.ObjectId(s));
    Bolsista.aggregate([
        {$match:
            {
                _id:{$in : objectIdArray}
            }
        },
        {$group:
            {
                _id:{colaborador:{idClbr:'$clbr.idClbr', nomeClbr:'$clbr.nome'}},
                bolsistas:{$addToSet: {cpf:'$cpf', nome:'$nome', id:'$_id'}} 
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
    ]).then((ans) =>{
        res.render('showResultadosNominal', {bolsistas:ans, paramRes:paramRes});
    });
});

module.exports = router;