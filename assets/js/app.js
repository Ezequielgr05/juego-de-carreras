import { game } from "./racetrackengine/core.js";

const seed = game.configuration.seed(0)
let positionNow = []
let detector = {
    position : undefined, 
    type : undefined
}
let cinematica = {
    APMS_State: 0, 
    KMH_State: 0, 
    IPMS_State: 0, 
    KMH_max: 600,
    IPMS_max_acc: 4000, 
    IPMS_max_dec: 2000, 
    IPMS_max_decCur: 2500, 
    IPMS_min: 500 
}

let configuration = game.configuration.inicializar("#road", seed, positionNow, detector)
let auto = configuration.auto
let aceleracion = game.car.accelerationCar(cinematica)
let desaceleracion = game.car.accelerationCar(cinematica, false) 
let desaceleracionCurva = game.car.accelerationCar(cinematica, false, true)
let updateDetector = game.car.createDetector(configuration.elemento, configuration.auto, false, configuration.detector)

console.log(configuration)
console.log(auto)
console.log(positionNow)
console.log(seed)

document.addEventListener("keypress", (event) => {
    // avanzar
    if (event.key == "w") {
        setTimeout(() => {
           game.car.avanzar(configuration, positionNow)
        }, 500);
        
    }
})
