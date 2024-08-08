function convertirAPenteduo(numeroDecimal) {
    const baseDecimalPersonalizada = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const base = baseDecimalPersonalizada.length;
    let resultado = '';

    while (numeroDecimal > 0) {
        let indice = numeroDecimal % base;
        resultado = baseDecimalPersonalizada[indice] + resultado;
        numeroDecimal = Math.floor(numeroDecimal / base);
    }

    return resultado || baseDecimalPersonalizada[0];
}

function agregarCeros(max, numero) {
    let largo;
    if (typeof numero === "string") {
        largo = numero.length;
    } else {
        let stringNumero = String(numero);
        largo = stringNumero.length;
        numero = stringNumero;
    }

    let resultado = "";
    if (largo < max) {
        let cerosquefaltan = max - largo;
        for (let index = 0; index < cerosquefaltan; index++) {
            resultado += '0';
        }
        resultado += numero;
        return resultado;
    } else {
        return numero;
    }
}

function generarCodigoDeDecoraciones() {
    let codigo = ""
    for (let i = 0; i < 16; i++) {
                let aux = Math.floor(7 * Math.random())
                codigo += aux
    }
    codigo = agregarCeros(9, convertirAPenteduo(codigo))
    return codigo
}
// genera un codigo de 9 caracteres

function generarCodigoConfiguracionDePista() {
    let codigo = ""
    for (let i = 0; i < 8; i++) {
                let aux = Math.floor(4 * Math.random())
                codigo += aux
    }
    codigo = agregarCeros(5, convertirAPenteduo(codigo))
    return codigo
}
// genera un codigo de 5 caracteres

function generarcodigoubicacion(largo) {
    let largoAUsar = (largo + 1) / 2
    let code = ""
    for (let i = 0; i < largoAUsar; i++) {
        let aux = Math.floor(4 * Math.random())
        code += aux
    }
    code = agregarCeros(9, convertirAPenteduo(code))
    return code
}
// genera un codigo de 9 caracteres

function generarCantidadDeRelleno() {
    let cantidad = Math.floor(21 * Math.random()) + 10
    let parImpar = cantidad%2

    if (parImpar === 0 && cantidad !== 10) {
        return cantidad - 1
    } else if (parImpar === 0 && cantidad === 10) {
        return cantidad + 1
    } else {
        return cantidad
    }
}

function seed(IDmapa) {
    let mapasConDecoracion = [0,1,2,5]
    let largo = generarCantidadDeRelleno()
    let seed = ""
    let decoraciones = "000000000"
    let decoUbi = "000000000"

    if (mapasConDecoracion.includes(IDmapa)) {
        decoraciones = generarCodigoDeDecoraciones()
        decoUbi = generarcodigoubicacion(largo)
    }
    let configuracionDePista = generarCodigoConfiguracionDePista()

    seed += IDmapa
    seed += largo
    seed += configuracionDePista
    seed += decoraciones
    seed += decoUbi

    return seed
}

// exportar
export {seed}