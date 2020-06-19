mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');
Ies = require('../../../models/ies');

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
                for(item of ansPop){
                    console.log(item._id.ies.sigla, item.qtde);
                }
                console.log(ansPop.length);
            } else{
                console.log(err);        
            }
        });
    } else {
        console.log(err);
    }
});