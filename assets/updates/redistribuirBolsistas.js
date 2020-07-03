mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var tools = require('../scripts/tools');
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
        if(ans.length > 0){
            if(!err){
                clbrIds = await tools.divisaoClbr(ans);
                var colaboradores = Object.keys(clbrIds);
                console.log(`Lista de users: ${colaboradores}`);
                var loader = '';
                for(clbr of colaboradores){
                    loader += '#';
                    console.log(`Updating: ${loader}`);
                    let usuario = clbr; //it seems unecessary but it is forcing variable scope for the async mongo promise
                    let bolsistas = clbrIds[usuario];
                    let filter = {'_id': {$in : bolsistas}};
                    let update = {$push :{'clbr':{'user': mongoose.Types.ObjectId(usuario)}}};
                    try{
                        await Bolsista.updateMany(filter,update);
                    } catch (e){
                        console.log(e);
                    }
                }
            } else {
                console.log(err);
            }
        } else{
            console.log('Não há bolsistas para esse colaborador');
        }
    });
} catch(err){
    console.log(err);
}