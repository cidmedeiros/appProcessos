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
                    _id:{colaborador:'$colaborador.user',
                    ies:{$arrayElemAt:['$pags.iesLocal', -1]}
                },
                    bolsistas:{$addToSet: {cpf:'$cpf', sei:'$sei', nome:'$nome', id:'$_id', email:{$arrayElemAt:['$email', -1]}}}
                }
            },
            {$set: {
                    qtdeBolsistasIes: {$size:'$bolsistas'}
                }
            },
            {$group:
                {
                    _id: {colaborador:'$_id.colaborador'},
                    listIes:{
                        $push:{ies:'$_id.ies', bolsistas:'$bolsistas'}
                    },
                    qtdeBolsistas: {$sum:'$qtdeBolsistasIes'}
                }
            },
            {$sort:
                {
                    qtdeBolsistas: -1,
                }
            }
        ]).then(async (ans) =>{
            await Ies.populate(ans, {path:'listIes.ies'}, async (error, ans) => {
                if(!error){
                    await User.populate(ans, {path:'_id.colaborador'}, async (error, ans) => {
                        if(!error){
                            for(var i = 0; i < ans.length; i++){
                                ans[i].listIes = await ans[i].listIes.sort(compareIes);
                                for(var j = 0; j < ans[i].listIes.length; j++){
                                    ans[i].listIes[j].bolsistas = await ans[i].listIes[j].bolsistas.sort(compareNome);
                                }
                            }
                            //console.log(util.inspect(ans[0].listIes, false, null, true /* enable colors */));
                            res.render('showResultadosNominal', {colaboradores:ans, paramRes:paramRes});
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
                    qtdeBolsistas: -1
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

var compareIes = (a,b) => {
    const bolsA = a.ies.sigla.toUpperCase();
    const bolsB = b.ies.sigla.toUpperCase();
    let comparison = 0;
    if (bolsA > bolsB) {
        comparison = 1;
    } else if (bolsA < bolsB) {
        comparison = -1;
    }
    return comparison;
}

var compareNome = (a,b) => {
    const bolsA = a.nome.toUpperCase();
    const bolsB = b.nome.toUpperCase();
    let comparison = 0;
    if (bolsA > bolsB) {
        comparison = 1;
    } else if (bolsA < bolsB) {
        comparison = -1;
    }
    return comparison;
}

module.exports = router;