import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import socket from '../../Socketio';


const barcosIniciales = [
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

const barcosTotales = 8;

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



export const Tablero = ({ nick, sala, emite }) => {
    const [tablero, setTablero] = useState([])
    const [barcoNo, setBarcoNo] = useState(0)
    const [barcos, setBarcos] = useState(barcosIniciales)
    const [barcoSeleccionado, setBarcoSeleccionado] = useState(0)
    const [btnListo, setBtnListo] = useState(false)
    const [listo, setListo] = useState(false)

    const [tableroContrincante, setTableroContrincante] = useState([])
    const [destruidos, setDestruidos] = useState(0)
    const [fires, setFires] = useState([])


    useEffect(() => {
        socket.emit('conectado', { nick, sala });
        setTablero(generarTablero())
        setTableroContrincante(generarTablero())
    }, [nick, sala])

    useEffect(() => {
        if (barcoNo === 2) {
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
        const datos = { sala, listo: true, nick }
        socket.emit('sala', datos, emite);
    }

    //recibe del bakend algo.
    useEffect(() => {
        socket.on('sala', jugada => {

            if (jugada.fire) {

                //modificamos el tablero
                const fuego = Number(jugada.fire)
                let barcoAfectado = false
                let numero = false
                //emitimos que si le dio a un barco y en donde. EMIT AFECTADO
                if (typeof tablero[fuego] !== 'number' && tablero[fuego] !== 'O') {
                    const dat = { sala, afecta: { fuego } }
                    socket.emit('sala', dat);
                }
                setTablero(tab => {
                    if (typeof tablero[fuego] === 'number') {
                        //console.log("NO le dio al barco.")
                        tab[fuego] = 'f'
                    } else {
                        //console.log("SI le dio al barco.")
                        //Si el golpe afecta un barco.y es diferente de estela.
                        numero = tablero[fuego].slice(1, 2)
                        barcoAfectado = tablero[fuego].slice(0, 1)
                        if (tablero[fuego].slice(-1) === 'i') {
                            tablero[fuego] = barcoAfectado + numero + 'fi'
                        } else {
                            tablero[fuego] = barcoAfectado + numero + 'f'
                        }
                    }
                    return tablero
                })
                //insertamos tiro al barco. y chequeamos si es destruido o no.
                if (barcoAfectado !== 'f' && barcoAfectado !== 'O') {
                    setBarcos(barcos => {
                        return barcos.map(barco => {
                            if (barco.id === Number(numero)) {
                                barco.tiros = barco.tiros + 1
                                //si esta emitimos diciendo cual. EMIT DESTRUIDO
                                if (barco.tiros === barco.size) {
                                    barco.alive = false
                                    const datos = { sala, destruido: { size: barco.size, vertica: barco.vertical, pos: barco.pos, emite: nick } }
                                    socket.emit('sala', datos);
                                    //sumamos un barco mas muerto
                                    setDestruidos(destruidos => destruidos + 1)
                                    //si matamos todos los barcos se acaba
                                    if (destruidos === barcosTotales) {
                                        //el otro ha ganado.
                                        const datos = { sala, fin: { ganador: 'tu' } }
                                        socket.emit('sala', datos);
                                    }
                                }
                            }
                            return barco
                        })
                    })
                }


            } else if (jugada.listo) { //Cuando el oponente esta listo.

                Swal.fire('Tu oponente está listo.')

            } else if (jugada.destruido) { //Cuando recibimos que destruimos un barco enemigo.

                setTableroContrincante(tab => {
                    for (let i = 0; i < jugada.destruido.size; i++) {
                        if (jugada.destruido.vertical) {
                            tableroContrincante[i + jugada.destruido.pos] = 'b'
                        } else {
                            tableroContrincante[i + jugada.destruido.pos] = 'b'
                        }
                    }
                    return tab
                })
                //Swal.fire('barco destruido.')

            } else if (jugada.afecta) { //Cuando recibimos si afectamos un barco

                setTableroContrincante(tab => {
                    tableroContrincante[jugada.afecta.fuego] = 'a'
                    return tab
                })

            } else if (jugada.fin) { //Cuando recibimos si afectamos un barco

                Swal.fire('Has Ganado la partida.')

            }
            setBarcoNo(e => e + 1)
        });
        return () => {
            socket.off()
        }
    }, [fires, tablero, destruidos, nick, sala, tableroContrincante, setFires])

    const fire = (e) => {
        e.target.className = 'tablero__miss'
        const datos = { sala, fire: e.target.id }
        socket.emit('sala', datos, emite);
    }

    const mostrarTablero = () => {
        console.log(barcos)
    }

    return (
        <div className="col">
            <div>
                <div className="tablero__titulo" style={{ display: listo ? '' : 'none' }}>
                    <h3>Mis barcos</h3>
                    <button onClick={mostrarTablero}>Console</button>
                </div>
                <div className="tablero__titulo" style={{ display: listo ? 'none' : '' }}>
                    <h3>Mis barcos</h3>
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
                    {
                        tablero.map((pos, index) => {
                            if (pos === 'O') {
                                return <div key={index} className="tablero__estela" id={pos} ></div>
                            } else if (pos === 'f') {
                                return <div key={index} className="tablero__bom" id={pos} ></div>
                            } else if (typeof pos !== 'number') {
                                if (pos.slice(-1) === 'i') {
                                    const id = Number(pos.slice(1, 2));
                                    const fir = pos.slice(-2, -1)
                                    switch (pos.slice(0, 1)) {
                                        case 'P':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className={fir === 'f' ? "tablero__barco__bom" : "tablero__barco"} id={pos} ><img style={{ opacity: barcos[id].alive ? "" : ".5" }} className="tablero__portaviones" src='./img/porta.svg' alt="barcos" /></div>
                                        case 'S':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className={fir === 'f' ? "tablero__barco__bom" : "tablero__barco"} id={pos} ><img style={{ opacity: barcos[id].alive ? "" : ".5" }} className="tablero__submarino" src='./img/sub.svg' alt="barcos" /></div>
                                        case 'A':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className={fir === 'f' ? "tablero__barco__bom" : "tablero__barco"} id={pos} ><img style={{ opacity: barcos[id].alive ? "" : ".5" }} className="tablero__artillero" src='./img/art.svg' alt="barcos" /></div>
                                        case 'R':
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className={fir === 'f' ? "tablero__barco__bom" : "tablero__barco"} id={pos} ><img style={{ opacity: barcos[id].alive ? "" : ".5" }} className="tablero__rescate" src='./img/res.svg' alt="barcos" /></div>
                                        default:
                                            return <div key={index} style={{ transform: barcos[id].vertical ? 'rotate(-90deg)' : '' }} className={fir === 'f' ? "tablero__barco__bom" : "tablero__barco"} id={pos} ><img style={{ opacity: barcos[id].alive ? "" : ".5" }} className="tablero__rescate" src='./img/res.svg' alt="barcos" /></div>

                                    }

                                } else if (pos.slice(-1) === 'f') {
                                    if ((pos.slice(0, 1) !== 'O' || typeof pos.slice(0, 1) === 'number') && pos.slice(0, 1) !== 'f') {
                                        return <div key={index} className="tablero__bom" id={pos}></div>
                                    } else {
                                        return <div key={index} className="tablero__miss" id={pos}></div>
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
                {
                    fires.map((fire, i) => {

                        return <span key={i}>{fire.fire}</span>
                    })
                }
                <div className="tablero__main">
                    {
                        tableroContrincante.map((pos, index) => {
                            if (pos === 'b') {
                                return <div key={index} className="tablero__barco__dead" id={pos} >{pos}</div>
                            }
                            else if (pos === 'a') {
                                return <div key={index} className="tablero__bom" id={pos} >{pos}</div>
                            } else if (pos === 'f') {
                                return <div key={index} className="tablero__miss" id={pos} >{pos}</div>
                            } else {
                                return <div key={index} className="tablero__agua" id={pos} onClick={fire}>{pos}</div>
                            }
                        })
                    }


                </div>
            </div>

        </div>
    )
}
