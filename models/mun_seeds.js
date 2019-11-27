//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Municipio = require('./municipios');
munData = require('../assets/dados/municipios.json'); //it returns a string
munData = JSON.parse(munData); //it parse the string to a iterable object


function cleanMun(){
    try{
        Municipio.deleteMany({}, (err) => {
            if(err){
                console.log('Error 1 trying to clean municipios data', err)
            } else {
                console.log('Municipios Removed')
            }
        });
    }catch(error){
        console.log('Error 2 trying to clean municipios data', err)
    }
};

Municipio.collection.insertMany(munData, addMun)

function addMun(err, docs){
    if(err){
        console.log(`Error 1 trying to save municipio ${err}`);
    } else{
        console.log('Municipios saved!');
    }
};