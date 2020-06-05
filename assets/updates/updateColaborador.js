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

var users = [
    {clbrNome:'André Amorim', id: mongoose.Types.ObjectId('5e21a1cec6fbcc262c905839')},
    {clbrNome:'Pricilla Oliveira', id: mongoose.Types.ObjectId("5e21a31ac6fbcc262c90583a")},
    {clbrNome:'Débora Gonçalves', id: mongoose.Types.ObjectId("5e21a4d3c6fbcc262c90583b")},
    {clbrNome:'Gilson Souza', id: mongoose.Types.ObjectId('5e21a677c6fbcc262c90583d')},
    {clbrNome:'Carlos Boselli', id: mongoose.Types.ObjectId('5e259c2307e8be0320a76467')},
    {clbrNome:'Mônica Gama', id: mongoose.Types.ObjectId('5e3ab2c5c3d09e39f8574cc6')},
    {clbrNome:'Mayra Gobbato', id: mongoose.Types.ObjectId('5e21a59ac6fbcc262c90583c')}
]

let updateUsers = async function(users){
    for(var i = 0; i < users.length; i++){
        let nome = users[i].clbrNome;
        let id = users[i].id
        let pipeFilter = {$expr : {$eq : [{"$arrayElemAt": ["$clbr.nome", -1]}, nome]}};
        let update = {$push :{'clbr':{'user': id}}};
        await Bolsista.updateMany(pipeFilter,update, (error, res) => {
            if(!error){
                console.log(`Successful updating: ${id}: ${nome}`);
                console.log(`Matches: ${res.n}`);
                console.log(`Modified: ${res.n}`);
            } else {
                console.log({'Error updating': error});
            }
        });
    };
};

/* //Check the update results
Bolsista.find(pipeFilter).populate('clbr.user')
.exec((err, data) => {
    if(!err){
        for(var i =0; i < data.length; i++){
            console.log(data[i].clbr);
        };
        console.log(data.length);
    } else{
        console.log(err);
    }
}); */

updateUsers(users);