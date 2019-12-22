mongoose = require('mongoose');

const MunDisplaySchema = new mongoose.Schema({
    uf: String,
    municipios:[{nome: String, ibge: String}]
});

module.exports = mongoose.model('MunicipioDisplay', MunDisplaySchema);