function getLocalIp() {
    const os = require('os');

    for(let addresses of Object.values(os.networkInterfaces())) {
        for(let add of addresses) {
            if(add.address.startsWith('172.19.')) {
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

module.exports = {
    getLocalIp:getLocalIp,
    treatInput:treatInput,
    calcPerm:calcPerm
}
