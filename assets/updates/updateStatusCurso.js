/*
    For safety and precision all updates are performed using the ObjectId() method;
    The pattern is use the pipeline aggregate method to achieve a final array with all
    ObjectId() items of interest.
    This pattern allows us to embed the _id list to the $ positional operator and thus
    update ONLY the desired documents.
    This pattern services the way the Bolsista model was built to be.
 */

mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

util = require('util')
ObjectId = require('mongodb').ObjectID;
Bolsista = require('../../models/bolsistas');

var changes = [{'filter': 'Concluído (Reingresso)', 'change': 'Concluído (Após Prazo Regular)'},
               {'filter': 'Abandonou o Curso', 'change': 'Evasão'}]

let updateStatus = async function(changes){
    for(var i = 0; i < changes.length; i++){
        let filter = changes[i].filter;
        let change = changes[i].change;
        let pipeFilter = {$expr : {$eq : [{'$arrayElemAt':['$statusCurso.status', -1]}, filter]}}
        let update = {'statusCurso.$.status': change};
        await Bolsista.aggregate([
            {$match: pipeFilter},
            {$group:
                {
                    _id:{},
                    lastStatus: {$addToSet: {$arrayElemAt:['$statusCurso', -1]}}
                }
            },
            {$group:
                {
                    _id:{},
                    idList : {$addToSet: '$lastStatus._id'}
                }
            }
        ]).then((singleList => {
            if(singleList.length > 0){
                let finalList = singleList[0].idList[0];
                finalList = finalList.map(s => mongoose.Types.ObjectId(s));
                Bolsista.updateMany({'statusCurso._id':{$in:finalList}},update, (error, res) => {
                    if(!error){
                        console.log(`Successful updating: ${change}`);
                        console.log(`Matches: ${res.n}`);
                        console.log(`Modified: ${res.n}`);
                    } else {
                        console.log({'Error updating': filter});
                    }
                });
            } else {
                console.log(`No matches for ${filter}`);
            }
        }));
    };
};

updateStatus(changes);


/* //Check the update results
let pipeFilter = {$expr : {$eq : [{'$arrayElemAt':['$statusCurso.status', -1]}, 'Abandonou o Curso']}} 
Bolsista.find(pipeFilter, (error, data) => {
    if(!error && data.length > 0){
        console.log(util.inspect(data, false, null, true));
        console.log(data.length);
    } else{
        console.log(error);
    }
}); */
