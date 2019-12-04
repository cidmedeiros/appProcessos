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

const associateBols = function(bolsista){
    ans = [];
    for(let i = 0; i <= (bolsista.pags.length-1); i++){
        Programa.findOne({'nome': bolsista.pags[i]['programa']}, (err, foundPro) => {
                if(err){
                    console.log(`Error finding programa ${bolsista.pags[i]['programa']}, ${err}`);
                } else {
                    bolsista.pags[i]['programa'] = foundPro;
                }
        })
        .exec()
        .then(Ies.findOne({'sigla':bolsista.pags[i]['iesLocal']}, (err, foundIes) => {
            if(err){
                console.log(`Error finding Ies ${bolsista.pags[i]['iesLocal']}, ${err}`);
            } else {
                bolsista.pags[i]['iesLocal'] = foundIes;
                let ref = bolsista.pags[i]['dataRef'].split('/');
                bolsista.pags[i]['dataRef'] = new Date(+ref[2], ref[1] - 1, +ref[0]);
                let dPag = bolsista.pags[i]['dataPag'].split('/');
                bolsista.pags[i]['dataPag'] = new Date(+dPag[2], dPag[1] - 1, +dPag[0]);
            }
            })
        )
        
    };
    console.log(`-------------Printing associateBols----------------------`);
    ans.push(bolsista);
    console.log(ans[0]['pags'][0]);
    return ans;
}

const addBols = function(bolsData) {
    const bolsistasData = preProcessBols(bolsData);
    try{
        Bolsista.insertMany(bolsistasData, (err, data) =>{
            if(err){
                console.log(`Error 1 trying to save bolsistas ${err}`);
            } else{
                console.log('Bolsistas saved!');
            }
        });
    } catch(error){
        console.log(`Error 2 trying to save bolsistas ${error}`);
    }
};

const seedBols = function(){
    cleanBols();
    addBols();
};

associateBols(bolsData[0]);

