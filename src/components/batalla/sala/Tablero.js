import React, { useEffect, useState } from 'react'

const barcosIniciales = [
    { id: 0, name: "Portaviones", size: 4, ident: 'P', vertical: false, puesto: false, pos: '-1', img: 'porta.svg' },
    { id: 1, name: "Submarino", size: 3, ident: 'S', vertical: false, puesto: false, pos: '-1', img: 'sub.svg' },
    { id: 2, name: "Submarino 2", size: 3, ident: 'S', vertical: false, puesto: false, pos: '-1', img: 'sub.svg' },
    { id: 3, name: "Artillero", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg' },
    { id: 4, name: "Artillero 2", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg' },
    { id: 5, name: "Artillero 3", size: 2, ident: 'A', vertical: false, puesto: false, pos: '-1', img: 'art.svg' },
    { id: 6, name: "Rescate 1", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg' },
    { id: 7, name: "Rescate 2", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg' },
    { id: 8, name: "Rescate 3", size: 1, ident: 'R', vertical: false, puesto: false, pos: '-1', img: 'res.svg' },
]

const cabeBarco = (where, barco) => {
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
const cabeBarcoVertical = (where, barco) => {
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


const generarTablero = () => {
    let tablero = []
    for (let i = 0; i < 100; i++) {
        tablero.push(i)
    }
    return tablero;
}

const ponerBarcoHorizontal = (tablero, barco, where, setBarcoNo, setBarcos) => {
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
const ponerBarcoVertical = (tablero, barco, where, setBarcoNo, setBarcos) => {
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



export const Tablero = () => {
    const [tablero, setTablero] = useState([])
    const [barcoNo, setBarcoNo] = useState(0)
    const [barcos, setBarcos] = useState(barcosIniciales)
    const [barcoSeleccionado, setBarcoSeleccionado] = useState(0)
    const [btnListo, setBtnListo] = useState(false)
    const [listo, setListo] = useState(false)

    const [tableroContrincante, setTableroContrincante] = useState([])


    useEffect(() => {
        setTablero(generarTablero())
        setTableroContrincante(generarTablero())
    }, [])
    useEffect(() => {
        if (barcoNo === 9) {
            setBtnListo(true)
        }
    }, [barcoNo])


    const ponerUnBarco = (e) => {
        if (barcos[barcoSeleccionado].puesto === true) { return }
        if (barcos[barcoSeleccionado].vertical === false) {
            setTablero(ponerBarcoHorizontal(tablero, barcos[barcoSeleccionado], e.target.id, setBarcoNo, setBarcos))
        } else {
            setTablero(ponerBarcoVertical(tablero, barcos[barcoSeleccionado], e.target.id, setBarcoNo, setBarcos))
        }
    }

    const voltearBarco = () => {
        setBarcos(barcos.map(barco => {
            if (barco.id === Number(barcoSeleccionado)) {
                barco.vertical = !barco.vertical
                return barco
            }
            return barco
        }))

    }

    const seleccionarBarco = (e) => {
        setBarcoSeleccionado(e.target.id)
    }

    const jugadorListo = () => {
        setListo(true)
    }

    const fire = (e) => {
        console.log("Fire en ", e.target.id)
        e.target.className = 'tablero__bom'
    }

    return (
        <div className="col">
            <div>
                <div className="tablero__titulo" style={{ display: listo ? 'none' : '' }}>
                    <h3>Mis barcos {barcoNo}</h3>
                    <div className="tablero__barcos">
                        <div className="tablero__seleccionado">
                            <div>
                                {barcos[barcoSeleccionado].name}
                            </div>
                            <span>Cantidad de celdas: {barcos[barcoSeleccionado].size}</span>
                            <span>click en el barco para rotar</span>
                            <img className="tablero__imgBarco" style={{ transform: barcos[barcoSeleccionado].vertical ? 'rotate(-90deg)' : '' }} src={`./img/${barcos[barcoSeleccionado].img}`} alt="barcoSelected" onClick={voltearBarco} />
                        </div>
                        <div className="tablero__lista">

                            {
                                barcos.map(barco => {
                                    return <button key={barco.id} style={barco.puesto ? { backgroundColor: '#037971' } : {}} className="btn btn-barcos" onClick={seleccionarBarco} id={barco.id}>{barco.name}</button>
                                })

                            }
                        </div>
                    </div>
                    <button className="btn btn-success" disabled={!btnListo} onClick={jugadorListo}>{!btnListo ? 'Desplegando flota!' : 'Listos'}</button>
                </div>
                <div className="tablero__main">
                    {/* <img className="tablero__submarino" src="./img/sub.svg" /> */}
                    {
                        tablero.map((pos, index) => {
                            if (pos === 'O') {
                                return <div key={index} className="tablero__estela" id={pos} ></div>
                            } else if (typeof pos !== 'number') {
                                if (pos.slice(-1) === 'i') {
                                    const id = Number(pos.slice(1, 2));


                                    switch (pos.slice(0, 1)) {
                                        case 'P':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className="tablero__barco" id={pos} ><img className="tablero__portaviones" src='./img/porta.svg' alt="barcos" /></div>
                                        case 'S':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className="tablero__barco" id={pos} ><img className="tablero__submarino" src='./img/sub.svg' alt="barcos" /></div>
                                        case 'A':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className="tablero__barco" id={pos} ><img className="tablero__artillero" src='./img/art.svg' alt="barcos" /></div>
                                        case 'R':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className="tablero__barco" id={pos} ><img className="tablero__rescate" src='./img/res.svg' alt="barcos" /></div>
                                        default:
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className="tablero__barco" id={pos} ><img className="tablero__rescate" src='./img/res.svg' alt="barcos" /></div>

                                    }

                                } else {
                                    return <div key={index} className="tablero__barco" id={pos}></div>
                                }


                            } else {
                                return <div key={index} className="tablero__agua" id={pos} onClick={ponerUnBarco}></div>
                            }
                        })
                    }

                </div>
            </div>
            <div>
                <h3> Aguas de mi oponente</h3>
                <div className="tablero__main">
                    {
                        tableroContrincante.map((pos, index) => {
                            return <div key={index} className="tablero__agua" id={pos} onClick={fire}></div>
                        })
                    }


                </div>
            </div>

        </div>
    )
}
