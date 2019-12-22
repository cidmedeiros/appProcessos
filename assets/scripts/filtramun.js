const input = document.getElementById('bolsista[ufCert]');
const muns = input.value;
input.addEventListener('input', filtMun);

/*
let uf = input.options[input.selectedIndex].text;

function filtMun(uf,municipios){
    munFiltered = [];
    municipios.forEach((mun) => {
        if(mun.uf === uf){
            munFiltered.push(mun)
        }
    });
    return munFiltered;
}
 */
