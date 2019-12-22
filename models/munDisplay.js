mongoose = require('mongoose');

const munDisplaySchema = new mongoose.Schema({
    uf: String,
    municipios:[{nome: String, ibge: String}]
});

module.exports = mongoose.model('MunicipioDisplay', munDisplaySchema);