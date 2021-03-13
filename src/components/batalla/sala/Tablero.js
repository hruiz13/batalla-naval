import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
import Swal from 'sweetalert2';
import socket from '../../Socketio';
import { barcosIniciales, ponerBarcoHorizontal, ponerBarcoVertical } from './helpers/barcos'

const barcosTotales = 8;

const generarTablero = () => {
    let tablero = []
    for (let i = 0; i < 100; i++) {
        tablero.push(i)
    }
    return tablero;
}

export const Tablero = ({ nick, sala, emite, sl }) => {
    const [tablero, setTablero] = useState([]) //es el tablero con sus numeros
    const [barcoNo, setBarcoNo] = useState(0)
    const [barcos, setBarcos] = useState(barcosIniciales) //son todos los barcos que se utilizaran
    const [barcoSeleccionado, setBarcoSeleccionado] = useState(0) //es el barco seleccionado
    const [btnListo, setBtnListo] = useState(false) //estado del boton listos.
    const [listo, setListo] = useState(false) //Estado si el jugadopr esta listo
    const [girar, setGirar] = useState(true)

    const [tableroContrincante, setTableroContrincante] = useState([]) //tablero del contrincante
    const [destruidos, setDestruidos] = useState(0) //cantidad de barcos destruidos
    const [fires, setFires] = useState([]) //tiros
    const [hayCompa, setHayCompa] = useState(sl) //si el compa esta conectado o no.
    const [compaListo, setCompaListo] = useState(false) //si el compa esta listo.
    const [turno, setTurno] = useState(false) //a quiern le toca el turno
    const [compa, setCompa] = useState('') //El nombre del compañero

    const history = useHistory()


    //useEffect inicial
    useEffect(() => {
        socket.emit('conectado', { nick, sala });
        setTablero(generarTablero())
        setTableroContrincante(generarTablero())
    }, [nick, sala])

    useEffect(() => {
        let listos = true
        barcos.forEach(barco => {
            if (barco.pos === '-1') {
                listos = false
            }
        })
        if (listos) {
            setBtnListo(true)
        }
        //setBtnListo(true)


    }, [barcoNo, barcos])


    const ponerUnBarco = (e) => {
        if (barcos[barcoSeleccionado].puesto === true) { return }
        if (barcos[barcoSeleccionado].vertical === false) {
            setTablero(ponerBarcoHorizontal(tablero, barcos[barcoSeleccionado], e.target.id, setBarcoNo, setBarcos))
        } else {
            setTablero(ponerBarcoVertical(tablero, barcos[barcoSeleccionado], e.target.id, setBarcoNo, setBarcos))
        }
        setGirar(false)
    }

    const voltearBarco = () => {
        if (girar) {
            setBarcos(barcos.map(barco => {
                if (barco.id === Number(barcoSeleccionado)) {
                    barco.vertical = !barco.vertical
                    return barco
                }
                return barco
            }))
        }

    }

    const seleccionarBarco = (e) => {
        setGirar(true)
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
            if (jugada.noEntras) {
                //Si ya hay 2 personas

                history.push({
                    pathname: '/',
                    search: '?ocupado=true',
                    state: {
                        update: true,
                    },
                });
            }

            if (jugada.turno) {
                if (sl === '1') { //soy false
                    setTurno(false)
                } else {
                    setTurno(true)
                }
            } else {
                if (sl === '1') { //soy false
                    setTurno(true)
                } else {
                    setTurno(false)
                }
            }

            if (jugada.fire) {

                //modificamos el tablero
                const fuego = Number(jugada.fire)
                let barcoAfectado = false
                let numero = false
                //emitimos que si le dio a un barco y en donde. EMIT AFECTADO
                if (typeof tablero[fuego] !== 'number' && tablero[fuego] !== 'O') {
                    const dat = { sala, afecta: { fuego } }
                    socket.emit('sala', dat);
                    setTurno(false)
                }
                //copio el tablero actual
                let tableroActual = [...tablero]

                if (typeof tableroActual[fuego] === 'number') {
                    //console.log("NO le dio al barco.")
                    tableroActual[fuego] = 'f'
                } else if (tableroActual[fuego] === 'O') {
                    //si le da a una estela
                    tableroActual[fuego] = 'Of'
                } else {
                    //console.log("SI le dio al barco.")
                    numero = tableroActual[fuego].slice(1, 2) //numero id del barco
                    barcoAfectado = tableroActual[fuego].slice(0, 1) //Tipo de barco (primera letra)
                    if (tableroActual[fuego].slice(-1) === 'i') { //Si es el que tiene imagen
                        tableroActual[fuego] = barcoAfectado + numero + 'fi'
                    } else {
                        tableroActual[fuego] = barcoAfectado + numero + 'f'
                    }


                    //insertamos tiro al barco. y chequeamos si es destruido o no.
                    let barcosActual = [...barcos]
                    barcosActual[numero].tiros = barcosActual[numero].tiros + 1

                    //si esta emitimos diciendo cual. EMIT DESTRUIDO
                    if (barcosActual[numero].tiros === barcosActual[numero].size) {
                        barcosActual[numero].alive = false
                        const datos = { sala, destruido: { size: barcosActual[numero].size, vertical: barcosActual[numero].vertical, pos: barcosActual[numero].pos, emite: nick } }
                        socket.emit('sala', datos);
                        //sumamos un barco mas muerto
                        setDestruidos(destruidos => destruidos + 1)
                        //cancelamos turno
                        setTurno(false)
                        //si matamos todos los barcos se acaba
                        if (destruidos === barcosTotales) {
                            //el otro ha ganado.
                            const datos = { sala, fin: { ganador: 'tu' } }
                            socket.emit('sala', datos);
                        }
                    }
                    setBarcos(barcosActual)




                }
                setTablero(tableroActual)




            } else if (jugada.listo) { //Cuando el oponente esta listo.
                //if()
                setCompaListo(e => !e)
                Swal.fire('Tu oponente está listo.')

            } else if (jugada.destruido) { //Cuando recibimos que destruimos un barco enemigo.

                setTableroContrincante(tab => {
                    if (jugada.destruido.vertical) {
                        //let i = donde; i > (donde - (barco.size * 10)); i = i - 10
                        for (let i = jugada.destruido.pos; i > (jugada.destruido.pos - (jugada.destruido.size * 10)); i = i - 10) {
                            if (jugada.destruido.vertical) {
                                tableroContrincante[i] = 'b'
                            } else {
                                tableroContrincante[i] = 'b'
                            }
                        }
                    } else {
                        for (let i = 0; i < jugada.destruido.size; i++) {
                            if (jugada.destruido.vertical) {
                                tableroContrincante[i + jugada.destruido.pos] = 'b'
                            } else {
                                tableroContrincante[i + jugada.destruido.pos] = 'b'
                            }
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

                Swal.fire('Has Ganado la partida!!!')

            } else if (jugada.dos) { //Cuando ya estan los 2 jugadores
                //setTurno(true)
                setCompa(jugada.quien)
                setHayCompa(true)
                //Swal.fire('Se ha unido el compa.')
            } else if (jugada.quien) {
                console.log(jugada.mismo)
                setCompa(jugada.quien)
            }
            setBarcoNo(e => e + 1)
        });
        return () => {
            socket.off()
        }
    }, [fires, tablero, destruidos, nick, sala, tableroContrincante, setFires, barcos, sl, history])

    const fire = (e) => {
        setTurno(false)
        e.target.className = 'tablero__miss'
        const datos = { sala, fire: e.target.id }
        socket.emit('sala', datos, emite);
    }

    // const mostrarTablero = () => {
    //     console.log(turno)
    // }

    return (
        <div>
            <div className="tablero__turno"> Turno de:  <span>{turno ? nick : compa}</span></div>

            <div className="col">
                <div>
                    <div className="tablero_tl_sp">
                        <div className="tablero__titulo" style={{ display: listo ? '' : 'none' }}>
                            <h3>Mis barcos</h3>
                            {/* <button onClick={mostrarTablero}>Console</button> */}
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
                    </div>
                    <div className="tablero__main">
                        {
                            tablero.map((pos, index) => {
                                if (pos === 'O') {
                                    return <div key={index} className="tablero__estela" id={pos} ></div>
                                } else if (pos === 'f') {
                                    return <div key={index} className="tablero__miss" id={pos} ></div>
                                } else if (typeof pos !== 'number') {
                                    if (pos.slice(-1) === 'i') { //ultimo digito
                                        const id = Number(pos.slice(1, 2));//despues de la letra inicial
                                        const fir = pos.slice(-2, -1) //antes de la i
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

                                    } else if (pos.slice(-1) === 'f') { //ultimo digito
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
                    <div className="tablero_tl_sp">
                        <h3> Aguas de mi oponente</h3>
                        {
                            !compaListo && <span>Esperando que oponente despliegue la flota...</span>
                        }
                    </div>
                    <div style={{ pointerEvents: compaListo && turno && listo ? 'auto' : 'none' }} className="tablero__main">
                        {
                            tableroContrincante.map((pos, index) => {
                                if (pos === 'b') {
                                    return <div key={index} className="tablero__barco__dead" id={pos} ></div>
                                }
                                else if (pos === 'a') {
                                    return <div key={index} className="tablero__bom" id={pos} ></div>
                                } else if (pos === 'f') {
                                    return <div key={index} className="tablero__miss" id={pos} ></div>
                                } else {
                                    return <div key={index} className="tablero__agua" id={pos} onClick={fire}></div>
                                }
                            })
                        }


                    </div>
                </div>

                {/* MODAL */}
                <div id="myModal" style={{ display: hayCompa ? 'none' : 'block' }} className="modal">

                    <div className="modal-content">
                        <h1>Batalla Naval</h1>
                        <h3>Juego en linea para 2</h3>
                        <p>Envia el siguiente link a quien sera tu compañero de juego!</p>
                        <h3>http://bn.hruiz.com/{sala}</h3>
                        <p>Esperando el compañero..</p>
                    </div>

                </div>

            </div>
        </div>
    )
}
