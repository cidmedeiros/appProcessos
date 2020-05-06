//Set DataBase
mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Ies = require('../../models/ies');
Programa = require('../../models/programa');
Bolsista = require('../../models/bolsistas');

const fs = require('fs');
sPath = 'G:/CGFO/CCB/Bolsas/geProcessos/appProcessos/assets/dados/bolsistasCargaAnterior2019/bolsistas.json'

const readFile = async (sPath) =>{
    let bolsData = fs.readFileSync(sPath);
    return bolsData;
}

const loadJson = async (sPath) =>{
    let bolsData = await readFile(sPath);
    bolsData = await JSON.parse(bolsData); //it parses the string to a iterable object
    return bolsData
}

//In case it's also needed to clean the DB
/* const cleanBols = function() {
    Bolsista.deleteMany({}, (err) => {
        if(err){
            console.log('Error 1 trying to clean Bolsistas data', err)
        } else {
                console.log('Bolsistas Removed')
            }
    });
}; */

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

         bolsista.pags[i].iesLocal = await Ies.findOne({'nome': bolsista.pags[i].iesLocal}, (err, foundOne) => {
            if(err){
                console.log(err)
            } else {
                return foundOne
            }
        });
        bolsista.pags[i].dataRef = new Date(bolsista.pags[i].dataRef);
        bolsista.pags[i].dataPag = new Date(bolsista.pags[i].dataPag);
    }
    bolsista.clbr[0].data = new Date(bolsista.clbr[0].data);
    
    return bolsista
};

const addBol = async (sPath) => {
    const bolsData = await loadJson(sPath);
    console.log(bolsData);
    refactored = [];
    try{
        for(bolsista of bolsData){
            refactored.push(await preProcBol(bolsista));
            console.log('Populating refactored bolsistas...');
        }
    } catch(error){
        console.log(`Populating refactored failed: ${error}`)
    }

    if(refactored.length > 0){
        console.log('Saving Bolsistas...');
        Bolsista.insertMany(refactored, (err, data) => {
            if(err){
                console.log(`InserMany error handling -> ${err}`);
            } else {
                console.log('Bolsistas saved!')
            }
        });
    }
}

addBol(sPath);