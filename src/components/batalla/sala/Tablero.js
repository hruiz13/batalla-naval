import React, { useEffect, useState } from 'react'

const barcosIniciales = [
    { name: "PortaAviones", size: 4, ident: 'PA', horizontal: true },
    { name: "Submarino", size: 3, ident: 'SU', horizontal: true },
    { name: "Submarino-2", size: 3, ident: 'SU', horizontal: true },
    { name: "Artillero", size: 2, ident: 'AR', horizontal: true },
    { name: "Artillero-2", size: 2, ident: 'AR', horizontal: true },
    { name: "Artillero-3", size: 2, ident: 'AR', horizontal: true },
    { name: "Rescate-1", size: 1, ident: 'RE', horizontal: true },
    { name: "Rescate-2", size: 1, ident: 'RE', horizontal: true },
    { name: "Rescate-3", size: 1, ident: 'RE', horizontal: true },
]

const cabeBarco = (where, barco) => {
    let donde = Number(where)
    if (donde < barco) {
        donde = 0
    }
    if (donde.toString().slice(-1) > (10 - barco)) {
        //console.log("ACA" + ((donde.toString().slice(0, 1) + 9) - Number(barco)))
        donde = (donde.toString().slice(0, 1) + 9) - Number(barco) + 1
        //console.log("Editado " + donde)
    }
    return Number(donde)
}


const generarTablero = () => {
    let tablero = []
    for (let i = 0; i < 100; i++) {
        tablero.push(i)
    }
    return tablero;
}

const ponerBarco = (tablero, barco, where, setBarcoNo) => {
    const donde = cabeBarco(where, barco.size)
    console.log("Se pondra en: " + donde)
    const tableroAnterior = [...tablero]
    let todoOk = true;
    for (let i = donde; i < (donde + barco.size); i++) {
        if (typeof tablero[i] === 'number') {

            tablero[i] = barco.ident
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
    } else {
        tablero = [...tableroAnterior]
    }

    return tablero

}

export const Tablero = () => {
    const [tablero, setTablero] = useState([])
    const [barcoNo, setBarcoNo] = useState(0)
    const [barcos, setBarcos] = useState(barcosIniciales)


    useEffect(() => {
        setTablero(generarTablero())
    }, [])


    const ponerUnBarco = (e) => {
        if (barcos.length === barcoNo) { return }
        setTablero(ponerBarco(tablero, barcos[barcoNo], e.target.id, setBarcoNo))
    }

    return (
        <div className="col">
            <div>
                Mis barcos
                <button onClick={ponerUnBarco}>{barcos[barcoNo]?.name}</button>
                <div className="tablero__main">
                    {
                        tablero.map((pos, index) => {
                            if (pos === 'O') {
                                return <div key={index} className="tablero__estela" id={pos}>{pos}</div>
                            } else if (typeof pos !== 'number') {
                                return <div key={index} className="tablero__barco" id={pos} >{pos}</div>
                            } else {
                                return <div key={index} className="tablero__agua" id={pos} onClick={ponerUnBarco}>{pos}</div>
                            }
                        })
                    }

                </div>
            </div>
            <div>
                Tablero de mi oponente
                <div className="tablero__main">


                </div>
            </div>

        </div>
    )
}
