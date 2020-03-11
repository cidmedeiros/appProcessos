mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('../../models/ies');

const filter = {'sigla':'UNIVASF'};
const update = {'nomeUf': 'Pernambuco', 'uf':'PE'}

Ies.findOneAndUpdate(filter, update, {new : true}, (err, data) => {
    if(!err){
        console.log(`Dados atualizados para ${filter.sigla}: ${data}`);
    } else{
        console.log({'Error': err});
    }
});