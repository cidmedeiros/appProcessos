mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var util = require('util');
var tools = require('../tools');
var Bolsista = require('../../../models/bolsistas');

Bolsista.aggregate([
    {$match:
        {termo : {$exists:true, $not:{$size: 0}}}
    },
    {$set:
        {
            permanencia: {$cond:[{$gte:['$permanenciaTotal', 60]}, 'Ao menos 60 meses', {$cond:[{$eq:['$permanenciaTotal', 0]},'Sem Permanência','Menos que 60 meses']}]},
            cursoLast: {$arrayElemAt: ['$statusCurso', -1]},
        }
    },
    {$set:
        {
            curso: {$cond:[{$eq:['$cursoLast.status', 'Concluído (Após Prazo Regular)']}, 'Concluído', '$cursoLast.status']}
        }
    },
    {$group:
        {_id: {
            status:'$curso',
            permanencia:'$permanencia',
            },
        bolsistas : {$addToSet : {'id':'$_id'}}
        }
    },
    {$set:
        {
            curso: '$_id.status',
            permanencia : '$_id.permanencia',
            qtde: {$size: '$bolsistas'},
        }
    },
    {$project:
        {_id:0, curso:1, permanencia:1, qtde:1}
    },
    {$sort:
        {qtde: -1}
    }
], (err, ans) => {
    if(!err){
        tools.saveToCsv('encargos', ans);
    } else{
        console.log(err);
    }
});