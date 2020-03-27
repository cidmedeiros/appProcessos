express = require('express');
router = express.Router();
mongoose = require('mongoose');
middleware = require('../middleware/middleware');
Bolsista = require('../models/bolsistas');
Ies = require('../models/ies');
User = require('../models/user');
util = require('util');

//Obs -> the id is just a hook to organizer front-end data
router.post('/resultadosnominalies/:id', middleware.isLoggedIn, (req, res) => {
    let paramRes = req.body.paramRes;
    let data = req.body.paramRes.bolsistas;
    var array = data.split(",");
    let objectIdArray = array.map(s => mongoose.Types.ObjectId(s));
    Bolsista.aggregate([
        {$match:
            {
                _id:{$in : objectIdArray}
            }
        },
        {$set:
            {
                ultPag:{$arrayElemAt:['$pags', -1]},
                ultEmail:{$arrayElemAt:['$email', -1]},
                ultClbr: {$arrayElemAt:['$clbr', -1]}
            }
        },
        {$set:
            {
                ies: '$ultPag.iesLocal'
            }
        },
        {$sort:
            {
                nome: 1
            }
        }
    ]).then(async (ans) => {     
        await Ies.populate(ans, {path:'ies'}, async (error, ans) =>{
            if(!error){
                await User.populate(ans, {path:'ultClbr.user'}, async (error, bolsistas) =>{
                    if(!error){
                        let dados = [];
                        await bolsistas.forEach(bolsista => {
                            item = {};
                            item.iesNome = bolsista.ies.nome;
                            item.iesSigla = bolsista.ies.sigla;
                            item.sei = bolsista.sei;
                            item.cpf = bolsista.cpf;
                            item.nome = bolsista.nome;
                            item.email = bolsista.ultEmail.email;
                            item.clbr = bolsista.ultClbr.user.fullname;
                            item.idBolsista = bolsista._id;
                            dados.push(item);
                        });
                        res.render('showSitBolsIes', {dados:dados, paramRes:paramRes});
                    } else{
                        console.log({'Error populating users': error});        
                    } 
                });
            } else {
                console.log({'Error populating ies': error});
            }
        });
    });
});

module.exports = router;