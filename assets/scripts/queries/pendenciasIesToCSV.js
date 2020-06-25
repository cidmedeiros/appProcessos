mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util');
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');
Ies = require('../../../models/ies');
User = require('../../../models/user');
fs = require('fs');
path = require('path');

var fileName = 'pendenciasIes1.txt';

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
    {$sort:
        {iesLocal:1, nome:1}
    }], (err, ans) => {
    if(!err){
        console.log('End aggregate. Begin populate');
        Ies.populate(ans, {path:'iesLocal'}, (err, ansIes) =>{
            if(!err){
                User.populate(ansIes, {path:'user'}, (err, ansFinal) => {
                    var bolsistasList = [];
                    for(bolsista of ansFinal){
                        let obj = {};
                        obj.ies = bolsista.iesLocal.sigla;
                        obj.sei = bolsista.sei;
                        obj.cpf = bolsista.cpf;
                        obj.nome = bolsista.nome;
                        obj.email = bolsista.lastEmail.email;
                        obj.colaborador = bolsista.user.fullname;
                        obj.curso = bolsista.curso.status;
                        obj.termo = bolsista.lastTermo.obsv;
                        bolsistasList.push(obj);
                    }
                    console.log(bolsistasList.length);
                    let titles = [Object.keys(bolsistasList[0])].concat(bolsistasList);
                    let csvFile = titles.map(it => {
                        return Object.values(it).toString();
                    }).join('\n');
                    fs.open(fileName,'wx', (err, fileDescriptor) =>{
                        if(!err && fileDescriptor){
                            console.log('file opened!');
                            fs.write(fileDescriptor, csvFile, (err) => {
                                if(!err){
                                    console.log('Beginning Writting!');
                                    fs.close(fileDescriptor, (err) => {
                                        if(!err){
                                            console.log('Success writting the file!');
                                        } else {
                                            console.log('error closing the file', err);
                                        }
                                    })
                                } else {
                                    console.log('error writing the file', err);
                                }
                            });
                        } else {
                            console.log(err);
                        }
                    });
                });           
            } else{
                console.log(err);        
            }
        });
    } else {
        console.log(err);
    }
});