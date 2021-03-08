import React from 'react'
import { Tablero } from './sala/Tablero'
import { TopNav } from './sala/TopNav'

export const SalaJuego = () => {
    return (
        <div className="sala__main-content">
            <TopNav />
            Sala de juego
            <Tablero />
        </div>
    )
}
