mongoose = require('mongoose');
Bolsista = require('./bolsistas');

const data = [{
    cpf: '123',
	nome: 'Bob',
	sexo: 'Male',
    colaborador: 'Mona',
    obsv: 'Observacoes aleatorias sobre o mundo...'
    },
    {
        cpf: '1234',
        nome: 'Boby',
        sexo: 'Male',
        colaborador: 'Peter',
        obsv: 'Observacoes aleatorias sobre o mundo...'
    },
    {
        cpf: '5437',
        nome: 'Tomas',
        sexo: 'Male',
        colaborador: 'Peter',
        obsv: 'Observacoes aleatorias sobre o mundo...'
    },
    {
        cpf: '98464',
        nome: 'Drama',
        sexo: 'Female',
        colaborador: 'Seb',
        obsv: 'Observacoes aleatorias sobre o mundo...'
    }
]

function seedDB(){
    Bolsista.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log('Bolsistas Removed')
    });
    data.forEach(function(seed){
        Bolsista.create(seed, (err, bolsista) =>{
            if(err){
                console.log(err);
            } else {
                console.log('added bolsista');
            }
        });
    });
}

module.exports = seedDB;