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
        {termo : {$exists:true, $not:{$size: 0}}}
    },
    {$set:
        {
            lastStatus: {$arrayElemAt:['$statusCurso', -1]},
            permanencia: {$cond:[{$gte:['$permanenciaTotal', 60]}, 'Ao menos 60 meses', {$cond:[{$eq:['$permanenciaTotal', 0]},'Sem Permanência','Menos que 60 meses']}]}
        }
    },
    {$group:
        {
            _id:{
                permanencia : '$permanencia',
                conclusao : '$lastStatus.status'
            },
            bolsistas: {$sum : 1},
            average : {$avg : '$permanenciaTotal'},
            min : {$min : '$permanenciaTotal'},
            max : {$max : '$permanenciaTotal'},
        }
    }
], (err, ans) => {
    if(!err){
        console.log(ans);
    } else{
        console.log(err);
    }
});