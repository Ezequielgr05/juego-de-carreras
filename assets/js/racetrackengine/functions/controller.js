function createAccelerate(variable) {
    const accelerationRate = 0.05;

    return () => {
        if (variable.APMS_State < 1) {
          variable.APMS_State += accelerationRate;  
        }
        variable.KMH_State = variable.KMH_max * variable.APMS_State;
        variable.IPMS_State = (variable.IPMS_max_acc + variable.IPMS_min) - (variable.IPMS_max_acc * variable.APMS_State);
        return variable.APMS_State;
    }
}

function createDecelerate(variable, curva = false) {
    const accelerationRate = 0.05;

    return () => {
        if (variable.APMS_State < 0) {
            variable.APMS_State -= accelerationRate;
        }
        if (curva) {
            variable.KMH_State = variable.KMH_min + (variable.KMH_max - variable.KMH_min) * (1 - variable.APMS_State);
            variable.IPMS_State = (variable.IPMS_max_dec + variable.IPMS_min) - (variable.IPMS_max_dec * variable.APMS_State);
        } else {
            variable.KMH_State = variable.KMH_max * variable.APMS_State;
            variable.IPMS_State = (variable.IPMS_max_decCur + variable.IPMS_min) - (variable.IPMS_max_decCur * variable.APMS_State);
        }
        return variable.APMS_State;
    }
}


function accelerationCar(variable, typeAccelerating = true, curva = false) {
    const acelerar = createAccelerate(variable);
    const desacelerar = createDecelerate(variable);
    const desacelerarCurva = createDecelerate(variable, curva)

    return () => {
        if (typeAccelerating) {
            return acelerar();
        } else if (curva) {
            return desacelerarCurva();
        } else {
            return desacelerar
        }
    }
} 

// para funcionar se necesita un objeto que tenga ciertas propiedades
// cinematica = {
// APMS_State: 0, el estado actual de la aceleracion (acceleration per milisecond)
// KMH_State: 0, el estado actual de los km/h (kilometers per hour)
// IPMS_State: 0, el estado actual de la tasa de impresion (impressions per milisecond)
// KMH_max: 600, la maxima km/h 
// IPMS_max_acc: 4000, la maxima tasa de impresion en aceleracion
// IPMS_max_dec: 2000, la maxima tasa de impresion en desaceleracion
// IPMS_max_decCur: 2500, la maxima tasa de impresion en desaceleracion en curva
// IPMS_min: 500 la minima tasa de impresion 
// } 
//y en variable va este objeto
function detectPista(coords, matriz) {
    let element = matriz[coords[0]][coords[1]]
    let elementClass = element.classList.value
    for (let i = 0; i < 4; i++) {
        if (elementClass.includes("recto-vertical" + i)) {
            return "rv"
        } else if (elementClass.includes("recto-horizontal" + i)) {
            return "rh"
        } else if (elementClass.includes("curva-arriba-izquierda" + i)) {
            return "cari"
        } else if (elementClass.includes("curva-arriba-derecha" + i)) {
            return "card"
        } else if (elementClass.includes("curva-abajo-izquierda" + i)) {
            return "cabi"
        } else if (elementClass.includes("curva-abajo-derecha" + i)) {
            return "cabd"
        } 
    }
}

function autoDo(orientacion, pista) {
    switch (pista) {
        case "rv":
            if (orientacion == "var") {
                return "goUp"
            } else if (orientacion == "vab") {
                return "goDown"
            }
            break;
        case "rh":
            if (orientacion == "hiz") {
                return "goLeft"
            } else if (orientacion == "hde") {
                return "goRight"
            }
            break;
        case "cari":
            if (orientacion == "hde") {
                return "goRight&TurnDown"
            } else if (orientacion == "var") {
                return "goUp&TurnLeft"
            }
            break;
        case "card":
            if (orientacion == "hiz") {
                return "goLeft&TurnDown"
            } else if (orientacion == "var") {
                return "goUp&TurnRight"
            }
            break;
        case "cabi":
            if (orientacion == "hde") {
                return "goRight&TurnUp"
            } else if (orientacion == "vab") {
                return "goDown&TurnLeft"
            }
            break;
        case "cabd":
            if (orientacion == "hiz") {
                return "goLeft&TurnUp"
            } else if (orientacion == "vab") {
                return "goDown&TurnRight"
            }
            break;
        default:
            break;
    }
}

function updateDetector(auto, variable, matrizElementos) {
    switch (auto.orientacion) {
        case "var": // Auto se mueve hacia arriba
            variable.position[0] = auto.pMatriz[0] - 1;
            variable.position[1] = auto.pMatriz[1];
            break;
        case "vab": // Auto se mueve hacia abajo
            variable.position[0] = auto.pMatriz[0] + 1;
            variable.position[1] = auto.pMatriz[1];
            break;
        case "hiz": // Auto se mueve hacia la izquierda
            variable.position[0] = auto.pMatriz[0];
            variable.position[1] = auto.pMatriz[1] - 1;
            break;
        case "hde": // Auto se mueve hacia la derecha
            variable.position[0] = auto.pMatriz[0];
            variable.position[1] = auto.pMatriz[1] + 1;
            break;
    }

    // Detectar el tipo de pista en la nueva posición del detector
    variable.type = detectPista(variable.position, matrizElementos);

    // Determinar la acción del auto
    let accion = autoDo(auto.orientacion, variable.type);
    
    return accion;
}

class detector {
    constructor(position, type) {
        this.position = position
        this.type = type
    }
}

function createDetector(matrizElementos, auto, init = false, variable = {}) {
    let pDetector = []
    let tDetector 

    if (init) {
        pDetector.push(auto.pMatriz[0] - 1, auto.pMatriz[1])
        tDetector = detectPista(pDetector, matrizElementos)
        return new detector(pDetector, tDetector)
    } else {
        return () => {
            return updateDetector(auto, variable, matrizElementos)
        }
    }
}

// function moveUp(variable, configuracion, actual, auto) {
//     let aceleracion = accelerationCar(variable, true)
//     let posicionEspacio = auto.pEspacio
//     let posicionMatriz = auto.pMatriz
//     let orientacion = auto.orientacion

//     setTimeout(() => {
//         avanzar(configuracion, actual)
//         aceleracion()
//     }, variable.IPMS_State);
// }

export {createDetector, accelerationCar}