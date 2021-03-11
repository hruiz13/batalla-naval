export const barcosIniciales = [
    { id: 0, name: "Portaviones", size: 4, ident: 'P', vertical: false, puesto: false, pos: '-1', img: 'porta.svg', tiros: 0, alive: true },
    { id: 1, name: "Submarino", size: 3, ident: 'S', vertical: false, puesto: false, pos: '-1', img: 'sub.svg', tiros: 0, alive: true },
    { id: 2, name: "Submarino 2", size: 3, ident: 'S', vertical: false, puesto: false, pos: '-1', img: 'sub.svg', tiros: 0, alive: true },
    { id: 3, name: "Artillero", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg', tiros: 0, alive: true },
    { id: 4, name: "Artillero 2", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg', tiros: 0, alive: true },
    { id: 5, name: "Artillero 3", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg', tiros: 0, alive: true },
    { id: 6, name: "Rescate 1", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg', tiros: 0, alive: true },
    { id: 7, name: "Rescate 2", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg', tiros: 0, alive: true },
    { id: 8, name: "Rescate 3", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg', tiros: 0, alive: true },
]

export const cabeBarco = (where, barco) => {
    let donde = Number(where)
    if (donde < barco) {
        donde = 0
    }
    if (donde.toString().slice(-1) > (10 - barco)) {
        if (donde > 9) {
            donde = (donde.toString().slice(0, 1) + 9) - Number(barco) + 1
        } else {
            donde = donde - Number(barco) + 1
        }
    }
    return Number(donde)
}
export const cabeBarcoVertical = (where, barco) => {
    let donde = Number(where)
    let digito = Number(where.slice(0, 1))
    if (donde > 10) {
        digito = Number(where.slice(1, 2))
    }

    if (donde < (barco - 1) * 10) {
        donde = digito + ((barco - 1) * 10)
    }
    return Number(donde)
}

export const ponerBarcoHorizontal = (tablero, barco, where, setBarcoNo, setBarcos) => {
    const donde = cabeBarco(where, barco.size)
    const tableroAnterior = [...tablero]
    let todoOk = true;
    for (let i = donde; i < (donde + barco.size); i++) {
        if (typeof tablero[i] === 'number') {
            if (i === donde) {
                tablero[i] = barco.ident + barco.id + 'i'
            } else {
                tablero[i] = barco.ident + barco.id
            }
            //Si el espacio es menor de 9 no se marca espacio superior
            if (i + 10 < 99) {
                if (typeof tablero[i + 10] === 'number') {
                    tablero[i + 10] = 'O'
                }
            }
            if (i - 10 > 0) {
                if (typeof tablero[i - 10] === 'number') {
                    tablero[i - 10] = 'O'
                }
            }

        } else {
            todoOk = false
        }
    }

    //si numero anterior termina en 9, no se colorea en espacio
    const numAnterior = (donde - 1).toString().slice(-1)
    if (numAnterior !== "9") {
        tablero[donde - 1] = 'O'
    }
    //si el numero siguiente termina en 0, no se colorea en espacio
    const siguiente = (donde + barco.size).toString().slice(-1)
    //console.log("El random es: " + random + " y el que sigue es " + siguiente)
    if (siguiente !== "0") {
        tablero[donde + barco.size] = 'O'
    }

    if (todoOk) {
        setBarcoNo(e => e + 1)
        //cambiamos el estado del barco a puesto.
        setBarcos(bar => {
            if (bar[barco.id].id === barco.id) {
                bar[barco.id].puesto = true
                bar[barco.id].pos = donde
            }
            return bar
        })
    } else {
        tablero = [...tableroAnterior]
    }
    return tablero
}
export const ponerBarcoVertical = (tablero, barco, where, setBarcoNo, setBarcos) => {
    const donde = cabeBarcoVertical(where, barco.size)
    const tableroAnterior = [...tablero]
    let todoOk = true;
    for (let i = donde; i > (donde - (barco.size * 10)); i = i - 10) {
        if (typeof tablero[i] === 'number') {
            if (i === donde) {
                tablero[i] = barco.ident + barco.id + 'i'
            } else {
                tablero[i] = barco.ident + barco.id
            }
            //Si el espacio es menor de 9 no se marca espacio superior
            if (((i + 1) % 10) !== 0) {
                if (typeof tablero[i + 1] === 'number') {
                    tablero[i + 1] = 'O'
                }
            }
            if ((i - 1).toString().slice(-1) !== '9') {
                if (typeof tablero[i - 1] === 'number') {
                    tablero[i - 1] = 'O'
                }
            }

        } else {
            todoOk = false
        }
    }

    //si numero anterior termina en 9, no se colorea en espacio
    if (donde - ((barco.size - 1) * 10) > 10) {
        tablero[donde - (barco.size * 10)] = 'O'
    }
    //si el numero siguiente termina en 0, no se colorea en espacio
    if (donde + 10 < 99) {
        tablero[donde + 10] = 'O'
    }

    if (todoOk) {
        setBarcoNo(e => e + 1)
        //cambiamos el estado del barco a puesto.
        setBarcos(bar => {
            if (bar[barco.id].id === barco.id) {
                bar[barco.id].puesto = true
                bar[barco.id].pos = donde
            }
            return bar
        })
    } else {
        tablero = [...tableroAnterior]
    }
    return tablero
}