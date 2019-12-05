//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':false});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('./ies');
Programa = require('./programa');
Bolsista = require('./bolsistas')

bolsData = require('../assets/dados/bolsistas.json');

const cleanBols = function() {
    Bolsista.deleteMany({}, (err) => {
        if(err){
            console.log('Error 1 trying to clean Bolsistas data', err)
        } else {
                console.log('Bolsistas Removed')
            }
    });
};

const preProcBol = async (bolsista) => {
    let indexes = [];

    for (let i = 0; i < bolsista.pags.length; i++){
        indexes.push(i);
    }

    for(i of indexes){
        bolsista.pags[i].programa = await Programa.findOne({'nome':bolsista.pags[i].programa},(err, foundOne) => {
            if(err){
                console.log(err)
            } else {
            return foundOne
            }
        });

         bolsista.pags[i].iesLocal = await Ies.findOne({'sigla': bolsista.pags[i].iesLocal}, (err, foundOne) => {
            if(err){
                console.log(err)
            } else {
                return foundOne
            }
        });
        let ref = bolsista.pags[i].dataRef.split('/');
        bolsista.pags[i].dataRef = new Date(+ref[2], ref[1] - 1, +ref[0]);
        let dPag = bolsista.pags[i].dataPag.split('/');
        bolsista.pags[i].dataPag = new Date(+dPag[2], dPag[1] - 1, +dPag[0]);
    }
    return bolsista
};