mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var util = require('util');
var tools = require('../tools');
var Bolsista = require('../../../models/bolsistas');
var User = require('../../../models/user');
var Ies = require('../../../models/ies');
const ies = require('../../../models/ies');

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
            lastClbr: {$arrayElemAt: ['$clbr', -1]},
            lastPag: {$arrayElemAt:['$pags', -1]}
        }
    },
    {$match:
        {
            $and: [{'curso.status': {$in : ['Reprovado']}}, {permanencia: {$in: ['Sem Permanência', 'Ao menos 60 meses','Menos que 60 meses']}}]
        }
    },
    {$set:
        {conclusao: '$curso.status', colaborador:'$lastClbr.user', ies:'$lastPag.iesLocal'}
    },
    {$project:
        {_id: 0, ies:1, sei:1, cpf:1, nome:1, conclusao:1, permanencia:1, colaborador:1}
    },
], (err, ans) => {
    if(!err){
        User.populate(ans, {path:'colaborador'}, (err, ansPop) => {
            if(!err){
                Ies.populate(ansPop, {path:'ies'}, (err, finalAns) => {
                    if(!err){
                        var data = [];
                        for(item of finalAns){
                            newObj ={};
                            newObj.ies = item.ies.sigla;
                            newObj.cpf = item.cpf;
                            newObj.sei = item.sei;
                            newObj.nome = item.nome;
                            newObj.conclusao = item.conclusao;
                            newObj.permanencia = item.permanencia;
                            newObj.colaborador = item.colaborador.fullname;
                            data.push(newObj);
                        }
                        tools.saveToCsv('reprovados', data);
                    }else {
                        console.log(err);
                    }
                });
            } else{
                console.log(err);
            }
        });
    } else{
        console.log(err);
    }
});