mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('../../models/ies');
Programa = require('../../models/programa');

const filter = {'nome':'PROFISICA'};
const update = {'coordNacional': [{_id: mongoose.Types.ObjectId('5eb2c846d0a8f32d340f5bf8'), fim: new Date(2019,10,01), ies: mongoose.Types.ObjectId('5e2083ffdf247905a4cfa212'), inicio: new Date(2013,08,01)}]}

Programa.findOneAndUpdate(filter, update, {new : true}, (err, data) => {
    if(!err){
        console.log(`Dados atualizados para ${filter.nome}: ${data}`);
    } else{
        console.log({'Error': err});
    }
});