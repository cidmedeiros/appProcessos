/* @TODO -> 1: agreggate to {_id Bolsista : _id último elemento array}
            2: resultado anterior armazena em filter
            3: definir função updateOne usando filter e $set
            4: iterar sobre coleção gerada por filter
 */

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../models/bolsistas');

const filter = {$expr : {$eq : [{"$arrayElemAt": ["$statusCurso.status", -1]}, 'Evadido']}};
const update = {'statusCurso.$.status': 'Abandonou o Curso'};

Bolsista.updateMany(filter, update, (err) =>{
    if(!err){
        console.log('Update Ok!');
    } else {
        console.log(err);
    }
});