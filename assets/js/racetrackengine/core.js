import { seed } from "./functions/seed.js";
import { inicializar, avanzarBg, retrocederBg } from "./functions/print.js";
import { createDetector, accelerationCar } from "./functions/controller.js";

const game = {
    configuration : {
        seed : seed,
        inicializar: inicializar
    },
    car : {
        avanzarBg : avanzarBg,
        retrocederBg: retrocederBg,
        createDetector: createDetector,
        accelerationCar: accelerationCar
    }
}

export {game}