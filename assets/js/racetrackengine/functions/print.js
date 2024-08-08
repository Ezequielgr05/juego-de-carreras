import {mapa} from './maps.js'
import { createDetector } from "./controller.js";

// estilos
const partPista = {
    rv : "recto-vertical",
    rh : "recto-horizontal",
    cari : "curva-arriba-izquierda",
    card : "curva-arriba-derecha",
    cabi : "curva-abajo-izquierda",
    cabd : "curva-abajo-derecha",
    cv : "comienzo-vertical",
    deco: "deco"
}

function letMatriz(id,lengthMatrizX, lengthMatrizY) {
    let matriz = []
    for (let i = 0; i <= lengthMatrizX; i++) {
        let newarray = []
        for (let j = 0; j <= lengthMatrizY; j++) { 
            let element = document.querySelector(id + i + j)
            newarray.push(element)
        }
        matriz.push(newarray)
    }

    return matriz
}

function cutCircuito(matrizCircuito, toLengthY, fromLengthY) {
    let matriz = matrizCircuito.slice(toLengthY, fromLengthY)
    return matriz
}

function cutCircuitFirst(circuito, actual) {
    let toY = 0;
    let fromY = 0;
    let largo = circuito.length - 1;
    let cutCircuito

    for (let i = 0; i < largo; i++) {
        if (circuito[i].includes("cv")) {
            fromY = i + 1;
            toY = i - 3;
        }
    }
    actual.push(toY, fromY)
    cutCircuito = circuito.slice(toY, fromY)
    return cutCircuito
}

function getVariableByName(variableName) {
    return partPista[variableName];
}

function asignClass(matriz, matrizElementos, inicializar = false, auto = undefined) {
    let rectas = ["rv", "rh"]
    let curvas = ["cabd", "cabi", "cari", "card"]

    matrizElementos.forEach((arrElementos, i) => {
        arrElementos.forEach((elemento, j) => {
            let itemMatriz = matriz[i][j]
            let itemNumber = itemMatriz.slice(-1)
            let itemName = itemMatriz.slice(0, itemMatriz.length - 1)

            if (rectas.includes(itemName) || curvas.includes(itemName) || "deco" == itemName) {
                elemento.className = ''
                elemento.classList.add(getVariableByName(itemName) + itemNumber)
            } else if (inicializar && ("cv" == itemMatriz || "ch" == itemMatriz)) {
                elemento.className = ''
                elemento.classList.add(getVariableByName(itemMatriz))
                elemento.innerHTML = '<img src="./assets/img/autos/auto1.png" alt="autito" class="corredor" id="jugador">';
                auto[0] = [i,j]
                if ("cv" == itemMatriz) {
                    auto[2] = "var"
                }
            } else if (!inicializar && ("cv" == itemMatriz || "ch" == itemMatriz)) {
                elemento.className = ''
                elemento.classList.add(getVariableByName(itemMatriz))
            }
        })
    })
}

class Auto {
    constructor (posicionMatriz, posicionEspacio, orientacion) {
        this.pMatriz = posicionMatriz
        this.pEspacio = posicionEspacio
        this.orientacion = orientacion
    }
}
// El objeto que devuelve es el siguiente
// auto {
//     pMatriz: [fila, columna]
//     pEspacio: [posicionX, posicionY]
//     orientacion: "vertical/horizontal + arriba/abajo/izquierda/derecha"
// }

class configuracion {
    constructor(circuito, elemento, auto, detector){
        this.circuito = circuito
        this.elemento = elemento
        this.auto = auto
        this.detector = detector
    }
}

function inicializar(id, seed, guardaractual) {
    let matrizElements = letMatriz(id, 3, 3);
    let circuito = mapa(seed);
    let matrizCircuito = cutCircuitFirst(circuito, guardaractual)

    // Auto
    let posicionMatriz
    let orientacion
    let auto = [posicionMatriz, [0,-1], orientacion]

    asignClass(matrizCircuito, matrizElements, true, auto)

    const autoActual = new Auto(auto[0], auto[1], auto[2])

    let detect = createDetector(matrizElements, autoActual, true)

    return new configuracion (circuito, matrizElements, autoActual, detect)
}

function retroceder(configuracion, actual) {
    let min = actual[0];
    let max = actual[1];
    let matrizCircuito = configuracion[0]
    let matrizElementos = configuracion[1]
    let limiteSuperior = matrizCircuito.length;

    if (max !== limiteSuperior) {
        min++;
        max++;
        let matrizCircuitoRecortado = cutCircuito(matrizCircuito, min, max);
        asignClass(matrizCircuitoRecortado, matrizElementos);
        actual[0] = min;
        actual[1] = max;
    }
}

function avanzar(configuracion, actual) {
    let limiteInferior = 0;
    let min = actual[0];
    let max = actual[1];
    let matrizCircuito = configuracion.circuito
    let matrizElementos = configuracion.elemento

    if (min !== limiteInferior) {
        min--;
        max--;
        let matrizCircuitoRecortado = cutCircuito(matrizCircuito, min, max);
        asignClass(matrizCircuitoRecortado, matrizElementos);
        actual[0] = min;
        actual[1] = max;
    }
}

export {inicializar, avanzar, retroceder}

// Una vez creada la seed se necesita crear una variable que tenga un array vacio dentro, para guardar la posicion actual del mapa
// tambien una variable vacia para guardar el detector
// Ademas se necesita de un id con la pantalla del juego 
// cuando se inicializa se debe guardar en una variable de configuracion, esta variable de configuracion contiene
// 1. el mapa del circuito
// 2. la matriz de los elementos en pantalla
// 3. un objeto que contiene las propiedades del auto
// Nota: luego se debe separar de la configuracion y ponerlo a parte