function getLocalIp() {
    const os = require('os');

    for(let addresses of Object.values(os.networkInterfaces())) {
        for(let add of addresses) {
            if(add.address.startsWith('192.168.')) {
                return add.address;
            }
        }
    }
};

function treatInput(input){
    const numbers = /^[0-9]+$/;
	input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	input = input.replace(/[^a-zA-Z0-9 ]/g, "");
	return input;
};

module.exports = {
    getLocalIp:getLocalIp,
    treatInput:treatInput
}