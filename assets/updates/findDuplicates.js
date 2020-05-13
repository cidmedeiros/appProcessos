mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../models/bolsistas');

//Find duplicates in a collection
const findDuplicates = (collection, callback) => {(collection.aggregate([
    {$group:
        {_id : {
            cpf:'$cpf'
            },
        idBolsistas : {$addToSet : {'id':'$_id', 'qtdeDeclara': {$size: '$declaracao'}, 'sei':'$sei'}}
        }
    },
    {$set:
        {
            qtdeId : {$size: '$idBolsistas'}
        }
    }
], (err, ans) => {
    if(!err && ans){
        let bolsistasDuplicados = ans.filter(bolsista => {return bolsista.qtdeId > 1});
        //console.log(util.inspect(bolsistasDuplicados, false, null, true /* enable colors */));
        //return bolsistasDuplicados;
        callback(false, bolsistasDuplicados);
    } else {
        callback(err);
    }
}))};

//Get Promise (an answer with delay)
const getBolsista = id => {
    return Bolsista.find({_id:ObjectId(id)});
};

//Handles all the promisses in a list
const forLoopPromiss = async bolsistasDuplicados => {
    let finalList = [];

    for (let index = 0; index < bolsistasDuplicados.length; index++) {
        for(let i = 0; i < bolsistasDuplicados[index].idBolsistas.length; i++){
            const id = bolsistasDuplicados[index].idBolsistas[i];
            const promissBol = await getBolsista(id);
            //Do whatever you want now
            let finalObj = {
                'cpf': promissBol[0].cpf,
                'id': promissBol[0]._id,
                'qtdeDeclara': promissBol[0].declaracao.length
            }
            finalList.push(finalObj);
        }
    }

    return finalList;
};

findDuplicates(Bolsista, async (err, bolsistasDuplicados) => {
    if(!err && bolsistasDuplicados.length > 0){
        var problematicos = {};
        problematicos.toBeUpdated = [];
        problematicos.toBeDeleted = [];
        let toBeUpdated = [];
        let toBeDeleted = [];
        for(pair of bolsistasDuplicados){
            let update = {}
            let deletion = {}
            for(bolsista of pair.idBolsistas){
                if(bolsista.qtdeDeclara >= 1){
                    update.id = bolsista.id;
                //Option in case there's a tie
                /* } else if(bolsista.sei !== 'a cadastrar'){
                    update.id = bolsista.id; */
                } else {
                    deletion.id = bolsista.id;
                    let bols = await getBolsista(bolsista.id);
                    let pags = bols[0].pags;
                    update.pags = pags;
                }
            }
            if(Object.keys(update).length >= 2){
                toBeUpdated.push(update);
                toBeDeleted.push(deletion);
            } else {
                problematicos.toBeUpdated.push(update);
                problematicos.toBeDeleted.push(deletion);
            }
        }
        console.log('update');
        console.log(toBeUpdated);
        console.log('deletion');
        console.log(toBeDeleted);
        console.log('loop cpf');
        for(cpf of toBeUpdated){
            console.log(`Updating lista de pagamentos for ${cpf.id}`);
            await Bolsista.findOneAndUpdate({_id:ObjectId(cpf.id)},{'$push': {'pags':{'$each':cpf.pags}}});
            let bols = await getBolsista(cpf.id);
            let pags = bols[0].pags;
            let valorList = [];
            pags.forEach((pag) => {
                valorList.push(pag.valor);
            });
            console.log(`Done Updating lista de pagamentos for ${cpf.id} -> OK!`);
            console.log(`Updating Valor total de bolsas for ${cpf.id}`);
            let valorTotal = valorList.reduce((a,b) => a+b, 0);
            await Bolsista.findOneAndUpdate({_id:ObjectId(cpf.id)},{'valorBolsas': valorTotal});
            console.log(`Done Updating Valor total de bolsas for ${cpf.id} -> OK!`);
        }
        for(cpf of toBeDeleted){
            console.log(`Deleting ${cpf.id}`);
            await Bolsista.deleteOne({_id:ObjectId(cpf.id)}, (err) => {
                if(err){
                    console.log(`Error deleting ${cpf.id}`);
                } else {
                    console.log(`Deletion ok!`);
                }
            });
        }
        console.log(`Não foi possivel homologar ${problematicos.toBeUpdated.length} bolsistas`);
        console.log(problematicos.toBeUpdated);
    } else {
        console.log({'error':err, 'data': bolsistasDuplicados});
    }
});

//CHECA BOLSISTAS PROBLEMÁTICOS PARA DUPLICIDADE
/* findDuplicates(Bolsista, (err, duplicados) => {
    if(!err && duplicados){
        console.log(duplicados.length);
        console.log(util.inspect(duplicados, false, null, true));
    } else {
        console.log(err);
    }
}); */