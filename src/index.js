console.log('Connected!');
import {Bolsista} from "./models/dataControl"
import {dom} from "./views/uiControl"
import './style.css';

const state = {};

const getInput = () => {
    state.bolsista = new  Bolsista(
        dom.cpfInput.value,
        dom.nomeInput.value,
        dom.sexoInput.value,
        dom.colabInput.value
    )
};

document.querySelector('.sendForm').addEventListener('submit', event =>{
    getInput();
    console.log(state.bolsista);
});