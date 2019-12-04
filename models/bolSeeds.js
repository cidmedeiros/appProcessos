//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('./ies');
Programa = require('./programa');
Bolsista = require('./bolsistas')

bolsData = require('../assets/dados/bolsistas.json');

const cleanProg = function() {
    try{
        Programa.deleteMany({}, (err) => {
            if(err){
                console.log('Error 1 trying to clean programa data', err)
            } else {
                console.log('Programas Removed')
            }
        });
    }catch(error){
        console.log('Error 2 trying to clean programa data', err)
    }
};

const addBols = function(){
    bolsData.forEach(bolsista => {
        bolsista.pags.forEach(pag => {
            
        });
        console.log(bolsista.pags[0].turma);
    });
}

addBols();


