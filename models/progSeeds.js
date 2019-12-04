//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('./ies');
Programa = require('./programa');
progData = require('../assets/dados/programas.json');

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

const addProg = function(){
    progData.forEach(element => {
        try{
            Ies.findOne({nome:element.coordNacional[0].ies}, (err, foundOne) => {
                if(err){
                    console.log(`error finding ${element.ies}`, err)
                } else {
                    element.coordNacional[0].ies = foundOne;
                    element.coordNacional[0].inicio = new Date(element.coordNacional[0].inicio+'Z');
                    element.coordNacional[0].fim = new Date(element.coordNacional[0].fim+'Z');
                    Programa.create(element, (err, saved) => {
                        if(err){
                            console.log(`error saving ${element}`, err)
                        } else{
                            console.log(`${saved} saved!`);
                        }
                    });
                }
            });            
        } catch(error){
            console.log(`error saving ${element}`, error);
        } 
    });   
};

const seedProg = function(){
    addProg();
};

seedProg();