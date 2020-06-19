router = express.Router();
mongoose = require('mongoose');
middleware = require('../middleware/middleware');
Bolsista = require('../models/bolsistas');
Ies = require('../models/ies');
User = require('../models/user');
util = require('util');

//Obs -> the id is just a hook to organizer front-end data
router.post('/resultadospendenciasies/:id', middleware.isLoggedIn, (req, res) => {
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
                lastTermo: {$arrayElemAt: ['$termo', -1]},
                curso: {$arrayElemAt: ['$statusCurso', -1]},
                ultEmail:{$arrayElemAt:['$email', -1]},
                ultClbr: {$arrayElemAt:['$clbr', -1]},

            }
        },
        {$project:
            {sei:1,nome:1,ultEmail:1,ultClbr:1,curso:1,lastTermo:1}
        },
        {$sort:
            {
                nome: 1
            }
        }
    ]).then(async (ans) => {
        await User.populate(ans, {path:'ultClbr.user'}, async (error, bolsistas) =>{
            if(!error){
                let dados = [];
                await bolsistas.forEach(bolsista => {
                    item = {};
                    item.sei = bolsista.sei;
                    item.nome = bolsista.nome;
                    item.email = bolsista.ultEmail.email;
                    item.clbr = bolsista.ultClbr.user.fullname;
                    item.curso = bolsista.curso.status;
                    item.termo = bolsista.lastTermo.obsv;
                    item.idBolsista = bolsista._id;
                    dados.push(item);
                });
                res.render('showPendNomIes', {dados:dados, paramRes:paramRes});
            } else{
                console.log({'Error populating users': error});
                res.render('bolsistaNaoEncontrado');      
            } 
        });
    });
});

module.exports = router;