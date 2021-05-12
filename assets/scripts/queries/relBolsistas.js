mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util');
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');
Ies = require('../../../models/ies');
User = require('../../../models/user');
Programa = require('../../../models/programa');
fs = require('fs');
path = require('path');

var fileName = 'relatorioBolsistasMonitoramento.txt';

Bolsista.aggregate([
    {$set:
        {
            lastTermo: {$arrayElemAt: ['$termo', -1]},
            curso: {$arrayElemAt: ['$statusCurso', -1]},
            lastPag: {$arrayElemAt: ['$pags', -1]},
            lastEmail: {$arrayElemAt: ['$email', -1]},
            lastClbr: {$arrayElemAt: ['$clbr', -1]}
        }
    },
    {$set:
        {
            iesLocal:'$lastPag.iesLocal',
            user:'$lastClbr.user',
            turma:'$lastPag.turma',
            programa:'$lastPag.programa'
        }
    },
    {$project:
        {iesLocal:1,programa:1,turma:1,sei:1,cpf:1,nome:1,lastEmail:1,user:1,curso:1,lastTermo:1,permanenciaTotal:1}
    },
    {$sort:
        {iesLocal:1, nome:1}
    }], (err, ans) => {
    if(!err){
        console.log('End aggregate. Begin populate');
        Ies.populate(ans, {path:'iesLocal'}, (err, ansIes) =>{
            if(!err){
                User.populate(ansIes, {path:'user'}, (err, ansSemiFinal) => {
                    Programa.populate(ansSemiFinal, {path:'programa'}, (err,ansFinal) => {
                        if(!err){
                            var bolsistasList = [];
                            for(bolsista of ansFinal){
                                let obj = {};
                                obj.programa = bolsista.programa.nome
                                obj.ies = bolsista.iesLocal.sigla;
                                obj.iesUF = bolsista.iesLocal.uf;
                                obj.turma = bolsista.turma;
                                obj.sei = bolsista.sei;
                                obj.cpf = bolsista.cpf;
                                obj.nome = bolsista.nome;
                                obj.email = bolsista.lastEmail.email;
                                obj.colaborador = bolsista.user.fullname;
                                if(bolsista.hasOwnProperty('curso')){
                                    obj.curso = bolsista.curso.status;
                                }else{
                                    obj.curso = 'não informado';
                                }
                                if(bolsista.hasOwnProperty('lastTermo')){
                                    obj.termoReg = bolsista.lastTermo.regular;
                                    obj.termoObs = bolsista.lastTermo.obsv;
                                }else{
                                    obj.termoReg = 'não informado'
                                    obj.termoObs = 'não informado'
                                }
                                obj.permanenciaTotal = bolsista.permanenciaTotal
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
                        }else{
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