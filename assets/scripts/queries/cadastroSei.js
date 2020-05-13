mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');
User = require('../../../models/user');

Bolsista.aggregate([
    {$match:
        {seiHist : {$exists:true, $not: {$size: 0}}}
    },
    {$group:
        {_id : {
            colaborador:'$clbr.user',
            usuario: '$seiHist.user'
            },
        idBolsistas : {$addToSet : {'id':'$_id'}}
        }
    },
    {$set:
        {
            qtdeId : {$size: '$idBolsistas'}
        }
    }
], async (err, ans) => {
    if(!err && ans){
        for(col of ans){
            let newCol = {};
            newCol.colaborador = col._id.colaborador[0];
            newCol.quantidade = col.qtdeId;
            newCol.usuario = col._id.usuario;
            await User.populate(newCol, {path: 'colaborador'}, (err, res) => {
                if(!err){
                    console.log(res.colaborador.fullname, res.usuario, res.quantidade);
                } else {
                    console.log(err);
                }
            });
        }
    } else {
        console.log(err);
    }
});