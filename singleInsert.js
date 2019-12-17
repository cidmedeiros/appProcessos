path = require("path");
express = require('express');
http = require("http");
bodyParser = require('body-parser');
mongoose = require('mongoose');
mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
methodOverride = require('method-override');
expressSanitizer = require('express-sanitizer');
tools = require('./assets/scripts/tools');
Bolsista = require('./models/bolsistas');

//App Variable
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static('assets'));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
const hostname = `${tools.getLocalIp()}`;
const port = 8087;

//Set DataBase
mongoose.connect('mongodb://localhost:27017/testDB', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Bolsista.findOneAndUpdate({sei:'23038.011600/2019-90'},
    {
        '$push':{'email':{'email':'cranbery@oister.com', 'data': new Date()}},
        'sexo': 'Masculino'
    },
    (err, upObejct) =>{
        if(err){
            console.log(err);
        } else{
            console.log(upObejct.email[upObejct.email.length-1]);
            console.log('Updated!');
        }
});

Bolsista.findOneAndUpdate({sei:'23038.011600/2019-90'},
    {'$push':
        {'docFoto':
            {
                'doc':'Identidade',
                'regular':'Regular',
                'obsv':'Ausente',
                'data': new Date(),
                'user':'Deb'
            }
        }
    },
    (err, upObejct) =>{
        if(err){
            console.log(err);
        } else{
            console.log(upObejct.docFoto[upObejct.docFoto.length -1]);
            console.log('Updated!');
        }
});