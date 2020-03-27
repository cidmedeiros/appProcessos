express = require('express');
router = express.Router();
mongoose = require('mongoose');
middleware = require('../middleware/middleware');
Bolsista = require('../models/bolsistas');
Ies = require('../models/ies');
User = require('../models/user');
util = require('util');

//Obs -> the id is just a hook to organizer front-end data
router.post('/resultadosnominal/:id', middleware.isLoggedIn, (req, res) => {
    let paramRes = req.body.paramRes;
    let data = req.body.listaBolsistas;
    var array = data.split(",");
    let objectIdArray = array.map(s => mongoose.Types.ObjectId(s));
    if(paramRes.consulta == 'colbr'){
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
                    qtdeBolsistas: {$size:'$bolsistas'}
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
    } else if(paramRes.consulta == 'ies'){
        Bolsista.aggregate([
            {$match:
                {
                    _id:{$in : objectIdArray}
                }
            },
            {$set:
                {
                    pags : {$arrayElemAt: ['$pags', -1]}
                }
            },
            {$set:
                {
                    ies: '$pags.iesLocal'
                }
            },
            {$group:
                {
                    _id:{ies:'$ies'},
                    bolsistas:{$addToSet:'$_id'}
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
            await Ies.populate(ans, {path:'_id.ies'}, async (error, ans) => {
                if(!error){
                    let dados = [];
                    await ans.forEach(element => {
                        let obj = {};
                        obj.iesNome = element._id.ies.nome;
                        obj.iesSigla = element._id.ies.sigla;
                        obj.bolsistas = element.bolsistas;
                        obj.qtdeBolsistas = element.qtdeBolsistas;
                        dados.push(obj);
                    });
                    //console.log(util.inspect(dados, false, null, true /* enable colors */));
                    res.render('showResultadosNominalIes', {dados:dados, paramRes:paramRes});
                } else {
                    console.log({'Error populating ies': error});
                }
            });
        });
    } 
    else {
        res.render('bolsistaNaoEncontrado');
    }
});

module.exports = router;