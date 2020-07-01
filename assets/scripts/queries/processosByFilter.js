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
            curso: {$arrayElemAt: ['$statusCurso', -1]},
            lastAnalise: {$arrayElemAt:['$analiseCompromisso', -1]},
            lastTermo: {$arrayElemAt:['$termo', -1]},
        }
    },
    {$match:
        {
            $and: [{'curso.status': {$in : ['Concluído', 'Desligado', 'Concluído (Após Prazo Regular)']}}, {permanencia: {$in: ['Sem Permanência']}}]
        }
    },
    {$set:
        {conclusao: '$curso.status'}
    },
    {$project:
        {sei:1, cpf:1, nome:1, conclusao:1, permanencia:1}
    },
], (err, ans) => {
    if(!err){
        tools.saveToCsv('processosByFilter', ans);
    } else{
        console.log(err);
    }
});