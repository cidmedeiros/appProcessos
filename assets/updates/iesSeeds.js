//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('../../models/ies');
iesData = require('../dados/iesMaternidade.json');

/* const cleanIes = function() {
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
}; */

const addIes = function() {
    try{
        Ies.insertMany(iesData, (err, data) =>{
            if(err){
                console.log(`Error 1 trying to save ies ${err}`);
            } else{
                console.log('Ies saved!');
            }
        });
    } catch(error){
        console.log(`Error 2 trying to save ies ${error}`);
    }
};

addIes();
