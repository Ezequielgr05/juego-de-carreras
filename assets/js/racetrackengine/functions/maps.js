// Combinaciones en bloque
const extremoSuperior0 = ["card", "rh", "rh", "cari"]
const extremoSuperior1 = ["card", "cari", "card", "cari"]
const relleno0 = ["rv", "deco", "deco", "rv"]
const relleno1 = ["rv", "rv", "rv", "rv"]
const comienzo0 = ["cv", "deco", "deco", "rv"]
const comienzo1 = ["cv", "rv", "rv", "rv"]
const extremoInferior0 = ["cabd", "rh", "rh", "cabi"]
const extremoInferior1 = ["cabd", "cabi", "cabd", "cabi"]
const vueltaArriba0 = ["rv", "cabd", "cabi", "rv"]
const vueltaAbajo0 = ["rv", "card", "cari", "rv"]



// mapas 
const circuito0 = [extremoSuperior0, relleno0, comienzo0, extremoInferior0]
const circuito1 = [extremoSuperior0, relleno0, comienzo0, relleno0, extremoInferior0]
const circuito2 = [extremoSuperior1, relleno1, vueltaArriba0, relleno0, comienzo0, extremoInferior0]
const circuito3 = [extremoSuperior1, relleno1, vueltaArriba0, vueltaAbajo0, comienzo1, relleno1, extremoInferior1]
const circuito4 = [extremoSuperior1, relleno1, vueltaArriba0, vueltaAbajo0, comienzo1, extremoInferior1]
const circuito5 = [extremoSuperior0, relleno0, comienzo0, relleno0, vueltaAbajo0, extremoInferior1]
const mapas = [circuito0, circuito1, circuito2, circuito3, circuito4, circuito5]

// funciones
function convertiraDecimal(penteduo) {
    const baseDecimalPersonalizada = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const base = baseDecimalPersonalizada.length;
    let resultado = 0;

    // Recorrer cada símbolo de penteduo de derecha a izquierda
    for (let i = 0; i < penteduo.length; i++) {
        let valorSimbolo = baseDecimalPersonalizada.indexOf(penteduo[penteduo.length - 1 - i]);
        resultado += valorSimbolo * Math.pow(base, i);
    }

    return resultado;
}

function desglosar(seed) {
    let IDmapa = seed[0]
    let largoRelleno = seed.slice(1,3)
    let configuracionPista = seed.slice(3,8)
    let configuracionDecoraciones = seed.slice(8,17)
    let configuracionUbicacionDecoracion = seed.slice(17,26)

    return [IDmapa, largoRelleno, configuracionPista, configuracionDecoraciones, configuracionUbicacionDecoracion]
}

function transBiMatriz(matriz) {
    let matriz1 = matriz.slice(0,4)
    let matriz2 = matriz.slice(4,8)
    let biMatriz = []

    for (let i = 0; i < 4; i++) {
        let aux = []
        aux.push(matriz1[i], matriz2[i])
        biMatriz.push(aux)
    }

    return biMatriz
}

function transDeco(deco) {
    let codigoDeco = String(convertiraDecimal(deco))
    let code1 = codigoDeco.slice(0,8)
    let code2 = codigoDeco.slice(8,16)
    let matriz = []

    for (let i = 0; i < 8; i++) {
        let aux = []
        aux.push(code1[i], code2[i])
        matriz.push(aux)
    }

    return matriz
}

function partePista(pistaconf) {
    let codigoPista = String(convertiraDecimal(pistaconf))
    if (codigoPista.length < 8) {
        codigoPista += 3
    }
    let pistaRecta = codigoPista.slice(0,4)
    let pistaCurva = codigoPista.slice(4,8)
    if (pistaCurva.length !== 4) {
        let faltante = 4 - pistaCurva.length
        let contador = Number(pistaCurva[0])
        for (let i = 0; i < faltante; i++) {
            pistaCurva += String(contador)
            contador = Number(pistaCurva[i])
        }
    }
    
    return [pistaRecta, pistaCurva]
}

function decoracion(decoConf) {
    if (verificar(decoConf)) {
        let data = transBiMatriz(transDeco(decoConf))
        data.forEach((matriz, i) => {
            matriz.forEach((arr, j) => {
                arr.forEach((item, k) => {
                    if (!item) {
                        data[i][j][k] = 6
                    }
                })
            })
        });
        return data
    } else {
        return null
    }
}

function confDecoracion(decoConf, large) {
    if (verificar(decoConf)) {
        let data = String(convertiraDecimal(decoConf))
        let aux = Math.ceil((large + 1) / 2);
        if (data.length != aux) {
            let faltante = aux - data.length;
            let originalData = String(convertiraDecimal(decoConf));
            
            for (let i = 0; i < faltante; i++) {
                data += originalData[i % originalData.length];
            }
        }
        return data
    } else {
        return null
    }
}

function esRelleno(seccion) {
    const bloquesRelleno = [
        ["rv", "deco", "deco", "rv"],
        ["rv", "rv", "rv", "rv"]
    ];
    
    // Verifica si la sección coincide con alguno de los bloques de relleno
    return bloquesRelleno.some(bloque => 
        JSON.stringify(bloque) === JSON.stringify(seccion)
    );
}

function agrandarPista(circuito, cantidad) {
    let nuevoCircuito = [];
    let seccionesRelleno = [];

    // Identificar todas las secciones de relleno
    circuito.forEach(seccion => {
        if (esRelleno(seccion)) {
            seccionesRelleno.push(seccion);
        }
    });

    // Calcular la cantidad de repeticiones para cada sección de relleno
    let cantidadPorSeccion = Math.ceil(cantidad / seccionesRelleno.length);
    let restante = cantidad - (cantidadPorSeccion * (seccionesRelleno.length - 1));

    circuito.forEach(seccion => {
        if (esRelleno(seccion)) {
            // Verifica si es la última sección de relleno
            let repeticiones = seccionesRelleno.length === 1 ? restante : cantidadPorSeccion;
            for (let i = 0; i < repeticiones; i++) {
                nuevoCircuito.push(seccion);
            }
            seccionesRelleno.shift(); // Elimina la primera sección de relleno del array
        } else {
            // Si no es una sección de relleno, agrégala tal cual
            nuevoCircuito.push(seccion);
        }
    });

    return nuevoCircuito;

}

function verificar(code) {
    if (code == "000000000") {
        return null
    } else {
        return code
    }
}

function decoracionFinal(deco, config) {
    let matriz = []
    for (let i = 0; i < config.length; i++) {
        for (let j = 0; j < 2; j++) {
            matriz.push(deco[Number(config[i])][j])
        }
    }
    return matriz
}

function asignarCurvas(mapTemplate, pista) {
    let curvas = pista[1];
    mapTemplate.forEach(arr => {
        arr.forEach((item, index, array) => {
            switch (item) {
                case "card":
                    array[index] += curvas[0];
                    break;
                case "cari":
                    array[index] += curvas[1];
                    break;
                case "cabi":
                    array[index] += curvas[2];
                    break;
                case "cabd":
                    array[index] += curvas[3];
                    break;
                default:
                    break;
            }
        });
    });
}

function compararArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

function estandarizacionArray(arr) {
    let arrMod = arr.slice()
    arrMod.forEach((item, index) => {
        if (item === "rv" || item === "rh") {
            arrMod[index] = 1
        } else {
            arrMod[index] = "x"
        }
    });

    return arrMod 
}

function estandarizacionArray_Deco(arr) {
    let arrMod = arr.slice()
    arrMod.forEach((item, index) => {
        if (item === "deco") {
            arrMod[index] = 1
        } else {
            arrMod[index] = "x"
        }
    });

    return arrMod 
}

function asignarRectas(mapTemplate, pista) {
    const comparePista = [
        {
        "id": 1,
        "case": [1, 1, 1, 1]
        },
        {
        "id": 2,
        "case": [1, "x", "x", 1]
        },
        {
        "id": 3,
        "case": ["x", 1, 1, "x"]
        },
        {
        "id": 4,
        "case": ["x", 1, 1, 1]
        },
        {
        "id": 5,
        "case": [1, 1, 1, "x"]
        },
        {
        "id": 6,
        "case": [1, "x", "x", "x"]
        },
        {
        "id": 7,
        "case": ["x", "x", "x", 1]
        }
    ]
    let rectas = pista[0]
    let contador = [0,0,0]

    mapTemplate.forEach(arr => {
        let aux = estandarizacionArray(arr)
        for (let i = 0; i < comparePista.length; i++) {
            if (compararArrays(aux, comparePista[i].case)) {
                switch (comparePista[i].id) {
                    case 1:
                        switch (contador[0]) {
                            case 0:
                                arr[0] += rectas[1]
                                arr[1] += rectas[2]
                                arr[2] += rectas[0]
                                arr[3] += rectas[2]
                                contador[0]++
                                break;
                            case 1:
                                arr[0] += rectas[0]
                                arr[1] += rectas[3]
                                arr[2] += rectas[1]
                                arr[3] += rectas[3]
                                contador[0]++
                                break;
                            case 2:
                                arr[0] += rectas[3]
                                arr[1] += rectas[0]
                                arr[2] += rectas[2]
                                arr[3] += rectas[0]
                                contador[0]++
                                break;
                            case 3:
                                arr[0] += rectas[2]
                                arr[1] += rectas[1]
                                arr[2] += rectas[3]
                                arr[3] += rectas[1]
                                contador[0] = 0
                                break;
                            default:
                                break;
                        }
                        break;
                    case 2:
                        switch (contador[1]) {
                            case 0:
                                arr[0] += rectas[3]
                                arr[3] += rectas[0]
                                contador[1]++
                                break;
                            case 1:
                                arr[0] += rectas[2]
                                arr[3] += rectas[1]
                                contador[1]++
                                break;
                            case 2:
                                arr[0] += rectas[1]
                                arr[3] += rectas[2]
                                contador[1]++
                                break;
                            case 3:
                                arr[0] += rectas[0]
                                arr[3] += rectas[3]
                                contador[1] = 0
                                break;
                            default:
                                break;
                        }
                        break;
                    case 3:
                        switch (contador[2]) {
                            case 0:
                                arr[1] += rectas[1]
                                arr[2] += rectas[2]
                                contador[2]++
                                break;
                            case 1:
                                arr[1] += rectas[0]
                                arr[2] += rectas[3]
                                contador[2] = 0
                                break;
                            default:
                                break;
                        }
                        break;
                    case 4:
                        for (let j = 1; j < arr.length; j++) {
                            arr[j] += rectas[j]
                        }
                        break;
                    case 5:
                        for (let j = 2; j >= 0; j--) {
                            arr[j] += rectas[j]
                        }
                        break;
                    case 6:
                        arr[0] += rectas[0]
                        break;
                    case 7:
                        arr[3] += rectas[3]
                        break;
                    default:
                        break;
                }
            }
        }
    });
}

function asignarDecoracion(mapTemplate, decoConf) {
    const decoCompare = ["x", 1, 1, "x"]
    let contador = 0
    mapTemplate.forEach((array, index) => {
        let arrayEstandar = estandarizacionArray_Deco(array)
        if (compararArrays(arrayEstandar, decoCompare) && contador < decoConf.length) {
            mapTemplate[index][1] += String(decoConf[contador][0])
            mapTemplate[index][2] += String(decoConf[contador][1])
            contador++
        }
    });
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function mapa(seed) {
    const configuracion = desglosar(seed)
    const map = mapas[configuracion[0]] //obtiene el id del mapa de la seed
    const large = Number(configuracion[1]) //obtiene el largo del mapa de la seed
    const pista = partePista(configuracion[2]) //obtiene un array que tiene la parte recta de la pista y la parte curva de la pista
    const deco = decoracion(configuracion[3]) //obtiene una matriz bidimensional que contiene 2 configuracion de decoracion, en caso de no haya decoracion obtiene un null
    const decoUbi = confDecoracion(configuracion[4], large) //obtiene un string que contiene la configuracion para usar la matriz bidemensional en caso de que no haya una configuracion obtendran un null 
    const mapTemp = agrandarPista(map, large) //le asigna el relleno correspondiente
    const decoConf = decoracionFinal(deco, decoUbi) //obtiene todas las decoraciones

    let mapTemplate = deepCopy(mapTemp)

    asignarCurvas(mapTemplate, pista)
    asignarDecoracion(mapTemplate,decoConf)
    asignarRectas(mapTemplate, pista)

    return mapTemplate
}

export {mapa}