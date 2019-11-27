//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('./ies');
iesData = require('../assets/dados/ies.json'); //it returns a string
iesData = JSON.parse(iesData); //it parse the string to a iterable object


function cleanIes(){
    try{
        Ies.deleteMany({}, (err) => {
            if(err){
                console.log('Error 1 trying to clean ies data', err)
            } else {
                console.log('Ies Removed')
            }
        });
    }catch(error){
        console.log('Error 2 trying to clean ies data', err)
    }
};

Ies.collection.insertMany(iesData, addIes);

function addIes(err, docs){
    if(err){
        console.log(`Error 1 trying to save ies ${err}`);
    } else{
        console.log('Ies saved!');
    }
};