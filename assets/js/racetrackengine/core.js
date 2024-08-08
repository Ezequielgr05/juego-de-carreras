import { seed } from "./functions/seed.js";
import { inicializar, avanzar, retroceder } from "./functions/print.js";
import { createDetector, accelerationCar } from "./functions/controller.js";

const game = {
    configuration : {
        seed : seed,
        inicializar: inicializar
    },
    car : {
        avanzar : avanzar,
        retroceder: retroceder,
        createDetector: createDetector,
        accelerationCar: accelerationCar
    }
}

export {game}