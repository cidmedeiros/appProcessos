express = require('express');
router = express.Router();
middleware = require('../middleware/middleware');
Bolsista = require('../models/bolsistas');
Ies = require('../models/ies');
User = require('../models/user');
util = require('util');


router.post('/resultadosnominal/:id', middleware.isLoggedIn, (req, res) => {
    let paramRes = req.body.paramRes;
    let data = req.body.listaBolsistas;
    var array = data.split(",");
    let objectIdArray = array.map(s => mongoose.Types.ObjectId(s));
    Bolsista.aggregate([
        {$match:
            {
                _id:{$in : objectIdArray}
            }
        },
        {$set :
            {
                colaborador : {$arrayElemAt: ['$clbr', -1]}
            }
        },
        {$group:
            {
                _id:{colaborador:'$colaborador'},
                bolsistas:{$addToSet: {cpf:'$cpf', sei:'$sei', nome:'$nome', id:'$_id', ultPag:{$arrayElemAt:['$pags', -1]}, email:{$arrayElemAt:['$email', -1]}}}
            }
        },
        {$set: {
                qtdeBolsistas: {$size:'$bolsistas'},
            }
        },
        {$sort: {
                qtdeBolsistas: -1,
            }
        }
    ]).then(async (ans) =>{
        await Ies.populate(ans, {path:'bolsistas.ultPag.iesLocal'}, async (error, ans) => {
            if(!error){
                await User.populate(ans, {path:'_id.colaborador.user'}, (error, ans) => {
                    if(!error){
                        //console.log(util.inspect(ans, false, null, true /* enable colors */));
                        res.render('showResultadosNominal', {bolsistas:ans, paramRes:paramRes});
                    } else {
                        console.log({'Error populating colaborador': error});
                    }
                });
            } else {
                console.log({'Error populating ies': error});
            }
        });
        
    });
});

module.exports = router;