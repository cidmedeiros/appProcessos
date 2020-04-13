//Required External Modules
path = require("path");
express = require('express');
https = require("https");
fs = require('fs');
bodyParser = require('body-parser');
mongoose = require('mongoose');
mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
methodOverride = require('method-override');
expressSanitizer = require('express-sanitizer');
passport = require('passport');
localStrategy = require('passport-local');
passportLocalMongoose = require('passport-local-mongoose');
tools = require('./assets/scripts/tools');
middleware = require('./middleware/middleware');
Bolsista = require('./models/bolsistas');
Ies = require('./models/ies');
Municipio = require('./models/municipios');
User = require('./models/user');

//App Variable
const app = express();
app.use(bodyParser.urlencoded({extended:true})); /* body-parser module parses the JSON, buffer, string and URL encoded data submitted using HTTP POST request. */
app.use(expressSanitizer());
app.use(express.static('assets'));
app.use(methodOverride("_method"));
app.use(require('express-session')({
	secret: 'inconstitucionalissimamente is a very fat massive long word',
	resave:false,
	saveUninitialized:false
}));

app.set('view engine', 'ejs');
const hostname = `${tools.getLocalIp()}`;
const port = 8087;

//Set DataBase
mongoose.connect('mongodb://localhost:27017/DBproc', {'useNewUrlParser': true, 'useUnifiedTopology':true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Set Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//It brings in code-decode methods from plugin in UserSchema
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//Routes Require
indexRoutes = require('./routes/index');
paginaDoBolsista = require('./routes/paginaDoBolsista');
consultaBolsista = require('./routes/consultaBolsista');
consultaColaborador = require('./routes/consultaColaborador');
editarDadosPessoais = require('./routes/editarDadosPessoais');
editarCompromisso = require('./routes/editarCompromisso');
addDeclaracao = require('./routes/addDeclaracao');
editaDeclaracao = require('./routes/editaDeclaracao');
deletaDeclaracao = require('./routes/deletaDeclaracao');
relatorioSitGeral = require('./routes/relatorioSitGeral');
resultadosNominal = require('./routes/resultadosNominal');
resultadosSitBolsIes = require('./routes/resultadosSitBolsIes');
cadastraSei = require('./routes/cadastraSei');

//Routes Applying
app.use(indexRoutes);
app.use(paginaDoBolsista);
app.use(consultaBolsista);
app.use(consultaColaborador);
app.use(editarDadosPessoais);
app.use(editarCompromisso);
app.use(addDeclaracao);
app.use(editaDeclaracao);
app.use(deletaDeclaracao);
app.use(relatorioSitGeral);
app.use(resultadosNominal);
app.use(resultadosSitBolsIes);
app.use(cadastraSei);

	//Routes order matters! This should always be the last route!!
app.get('*', middleware.isLoggedIn, async (req, res) =>{
	console.log('Waiting...');
	try{
		res.status(200).send("Sorry, We don't have any content here... yet :)");
		console.log('App status: nominal.');
	} catch(error){
		console.log(error);
	}
});

//Server Activation
/* Command to renew keys for ssl connection: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 */
var activateServer = function(hostname, port){
	https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
	passphrase: 'somethingidontknow'},
	app).listen(port);
	console.log(`Server running at https://${hostname}:${port}/`);
}
activateServer(hostname, port);