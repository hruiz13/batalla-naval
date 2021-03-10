import React from 'react'
import { Tablero } from './sala/Tablero'
import { TopNav } from './sala/TopNav'
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';

export const SalaJuego = () => {
    const location = useLocation();
    const history = useHistory()
    const { nick, sala } = queryString.parse(location.search)
    if (!sala) {
        history.push('/');
    }
    //socket.emit('conectado', { nick, sala });
    return (
        <div className="sala__main-content">
            <TopNav />
            <Tablero nick={nick} sala={sala} />
        </div>
    )
}
