mongoose = require('mongoose');
User = require('./user');

const processoSchema = new mongoose.Schema({
    codAuto: Number,
    posicao: String,
    promocao: Number,
    implicado: Number,
    significado: String,
    disponibilidade: Number,
    condDispo: String,
    prazo: Number,
    gatilho: [{codAuto: Number}],
    usuario: [{user:{type: mongoose.Schema.Types.ObjectId,	ref: 'User'}, data: Date}],
});

module.exports = mongoose.model('Processo', processoSchema);