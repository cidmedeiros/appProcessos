//Repeatedly used functions
fs = require('fs');

function getLocalIp() {
    const os = require('os');

    for(let addresses of Object.values(os.networkInterfaces())) {
        for(let add of addresses) {
            if(add.address.startsWith('172.19')) {
                return add.address;
            }
        }
    }
};

function treatInput(input){
    const numbers = /^[0-9]+$/;
	input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    input = input.replace(/[^a-zA-Z0-9 ]/g, "");
    if(input.match(numbers)){
		if(input.length === 11){
            return ['cpf', `${input.slice(0,3)}.${input.slice(3,6)}.${input.slice(6,9)}-${input.slice(9)}`]
        } else if(input.length === 17){
            return['sei', `${input.slice(0,5)}.${input.slice(5,11)}/${input.slice(11,15)}-${input.slice(15)}`]
        } else {
            return ["Dado de CPF ou SEI inválido! Verifique os dados informados.", input]
        }
	} else {
		input = input.toUpperCase();
		return ['nome', input];
	}
};

function calcPerm(declaracao){
    let perm = 0;
    declaracao.forEach(decla => {
        if(decla.regular == "Regular" && decla.obsv !== 'Ensino Superior'){
            perm = decla.permanencia + perm;
        } 
    });
    return perm;
};

function saveToCsv(fileName, data){
    let titles = [Object.keys(data[0])].concat(data);
    let csvFile = titles.map(it => {
        return Object.values(it).toString();
    }).join('\n');
    fs.open(`${fileName}.txt`,'wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            console.log('file opened!');
            fs.write(fileDescriptor, csvFile, 'utf8', (err) => {
                if(!err){
                    console.log('Beginning Writting!');
                    fs.close(fileDescriptor, (err) => {
                        if(!err){
                            console.log('Success writting the file!');
                        } else {
                            console.log('error closing the file', err);
                        }
                    })
                } else {
                    console.log('error writing the file', err);
                }
            });
        } else {
            console.log(err);
        }
    });
};

function divisaoClbr(bolsistas){

    /* 
       * input: bolsistas -> ids sorted list;
       * output: dict clbr(key), bolsistas atribuídos(array of values);
       * Applicable for the current 6 users;
    */
    
    //Index máximo para array fornecida
    var topIndex = bolsistas.length-1;
    console.log('Top Index :', topIndex);

    //Multiplicador mínimo (fator)
    var factor = Math.floor(bolsistas.length/10);
    
    //Peso de distribuição
    var clbrsCarga = {'5e21a1cec6fbcc262c905839':2,'5e21a4d3c6fbcc262c90583b':2,'5e21a59ac6fbcc262c90583c':2,'5e21a31ac6fbcc262c90583a':2,'5e3ab2c5c3d09e39f8574cc6':1,'5e259c2307e8be0320a76467':1};
    
    //Variáveis início da lista, fim da lista e lista de indexes
    var init = 0;
    var maxInd = 0;
    var clbrsIndexes = {};
    
    //Popula cada colaborador com sua lista de indexes
    var cc = 1;
    Object.keys(clbrsCarga).forEach(key => {
        console.log('------------');
        console.log(`iteration: ${cc}`);
        console.log('init: ', init);
        maxInd = init + Math.floor(clbrsCarga[key]*factor);
        if(maxInd > topIndex){
            maxInd = topIndex
        }
        console.log('maxInd: ', maxInd);
        clbrsIndexes[key] = [];
        for(var i = init; i <= maxInd; i++){
            clbrsIndexes[key].push(i);
        }
        init = maxInd+1;
        cc++;
    });
    console.log('------------');
    
    //Atribui o resto(remainder) da divisão
    var resto = topIndex - maxInd;
    if(resto > 0){
        console.log('resto: ', resto);
        for(var i = maxInd; i <= (maxInd+resto); i++){
            clbrsIndexes['5e259c2307e8be0320a76467'].push(i);
        }
    } else {
        console.log('Não teve resto');
    }

    //Checa correção da distruição dos indexes
    var counter = 0
    Object.keys(clbrsIndexes).forEach(key => {
        counter += clbrsIndexes[key].length;
        console.log('clbr: ',key,'1º: ', clbrsIndexes[key][0], 'last: ', clbrsIndexes[key][clbrsIndexes[key].length -1], 'length: ', clbrsIndexes[key].length);
    });
    console.log('Length da array original: ', counter);
    console.log('Soma length das arrays distribuídas: ', counter);

    //Objeto final -> clbrIds:array id bolsistas
    var clbrIds = {};
    var colaboradores = Object.keys(clbrsIndexes);

    for(var i = 0; i < bolsistas.length; i++){
        for(key of colaboradores){
            if(clbrsIndexes[key].includes(i)){
                if(clbrIds.hasOwnProperty(key)){
                    clbrIds[key].push(bolsistas[i]._id);
                    break;
                } else {
                    clbrIds[key] = [];
                    clbrIds[key].push(bolsistas[i]._id);
                    break;
                }
            } 
        };
    }

    Object.keys(clbrIds).forEach(key => {
        console.log(key, 'first id:', clbrIds[key][0], 'last id:', clbrIds[key][clbrIds[key].length-1], 'length:', clbrIds[key].length);
    });
    return clbrIds;
}

module.exports = {
    getLocalIp:getLocalIp,
    treatInput:treatInput,
    calcPerm:calcPerm,
    saveToCsv:saveToCsv,
    divisaoClbr:divisaoClbr
}
