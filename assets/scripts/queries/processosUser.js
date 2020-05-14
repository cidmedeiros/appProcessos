mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');
User = require('../../../models/user');
fs = require('fs');
path = require('path');

Bolsista.aggregate([
    {$match:
        {'seiHist.user' : 'MÔNICA SANTOS'}
    },
    {$set:
        {processo : {$arrayElemAt: ['$seiHist', -1]}}
    }
], (err, ans) => {
    var listProc = [];
    if(!err){
        for(bol of ans){
            listProc.push(bol.processo);
        }
    } else{
        console.log(err);
    }
    let titles = [Object.keys(listProc[0])].concat(listProc);
    let csvFile = titles.map(it => {
        return Object.values(it).toString()
    }).join('\n')
    console.log(typeof(csvFile));
    fs.open('C:/Users/cidm/Documents/processos.txt','wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            console.log('file opened!')
            fs.write(fileDescriptor, csvFile, (err) => {
                if(!err){
                    console.log('Beginning Writting!')
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            console.log('Success writting the file!')
                        } else {
                            console.log('error closing the file', err)
                        }
                    })
                } else {
                    console.log('error writing the file', err)
                }
            });
        }
    });
});