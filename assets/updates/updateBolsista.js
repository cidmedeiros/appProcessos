mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Bolsista = require('../../models/bolsistas');

const filter = {'cpf':'004.061.545-62'};
const update = {'$push':{'clbr': {'user': mongoose.Types.ObjectId('5e21a59ac6fbcc262c90583c'), data: new Date()}}}

Bolsista.findOneAndUpdate(filter, update, {new : true}, (err, data) => {
    if(!err){
        console.log(`Dados atualizados para ${filter}: ${data}`);
    } else{
        console.log({'Error': err});
    }
});