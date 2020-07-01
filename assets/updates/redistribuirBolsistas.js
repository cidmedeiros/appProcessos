mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const tools = require('../scripts/tools');
util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../models/bolsistas');
User = require('../../models/user');
path = require('path');

try {
    Bolsista.aggregate([
    {$set:
        {lastClbr: {$arrayElemAt: ['$clbr', -1]}}
    },
    {$match:
        {'lastClbr.user':mongoose.Types.ObjectId('5e21a677c6fbcc262c90583d')}
    },
    {$sort:
        {cpf:1}
    },
    {$project:
        {_id:1}
    }
    ], async (err, ans) => {
        if(!err){
            clbrIds = await tools.divisaoClbr(ans);
            var colaboradores = Object.keys(clbrIds);
            console.log(`Lista de users: ${colaboradores}`);
            for(clbr of colaboradores){
                let usuario = clbr; //it seems unecessary but it is forcing variable scope for the async mongo promise
                let bolsistas = clbrIds[usuario];
                let filter = {'_id': {$in : bolsistas}};
                let update = {$push :{'clbr':{'user': mongoose.Types.ObjectId(usuario)}}};
                await Bolsista.find(filter, (err, found) => {
                    if(!err){
                        console.log('-------------------------------------------------------------------------------------');
                        console.log(`User: ${usuario} ----- Searched for: ${bolsistas.length}. Found: ${found.length}`);
                        console.log(`First one -> user: ${found[0].clbr} --- nome: ${found[0].nome}`);
                        console.log('                           ----                           ');
                        console.log(`Last one -> user: ${found[found.length-1].clbr} --- nome: ${found[found.length-1].nome}`);
                    } else {
                        console.log(err);
                    }
                });
            }
        } else {
            console.log(err);
        }
    });
} catch(err){
    console.log(err);
}