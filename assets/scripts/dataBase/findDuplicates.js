mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../../models/bolsistas');

let findDuplicates = (Collection) => {(Collection.aggregate([
    {$group:
        {_id : {
            cpf:'$cpf'
            },
        idBolsistas : {$addToSet : '$_id'}
        }
    },
    {$set:
        {
            qtdeId : {$size: '$idBolsistas'}
        }
    }
], (err, ans) => {
    if(!err && ans){
        let bolsistasDuplicados = ans.filter(bolsista => {return bolsista.qtdeId > 1});
        console.log(util.inspect(bolsistasDuplicados, false, null, true /* enable colors */));
        return bolsistasDuplicados;
        //console.log(util.inspect(bolsistasDuplicados, false, null, true /* enable colors */));
    } else {
        console.log(err)
    }
}))};

findDuplicates(Bolsista);