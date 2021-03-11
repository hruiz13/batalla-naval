import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
const nod = require("node-code-generator")

var generator = new nod();
const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678abcdefghijklmnopqrstuvwxyz'
const howMany = 10;
const code = generator.randomChars(allowedChars, howMany);

export const StartScreen = () => {
    const [nick, setNick] = useState('');
    const [sala, setSala] = useState('')
    const history = useHistory()
    const { salaId } = useParams();

    useEffect(() => {
        if (salaId) {
            setSala(`?sala=${salaId}&nick=${nick}&sl=1`)
        } else {
            setSala(`?sala=${code}&nick=${nick}`)
        }
    }, [salaId, nick])


    const handleChange = (e) => {
        setNick(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nick !== "") {

            history.push({
                pathname: '/sala',
                search: sala,
                state: {
                    update: true,
                },
            });
        }

    }


    return (

        <div className="start__box-container">
            <h3 className="start__title">Batalla Naval / Reactjs</h3>
            <form onSubmit={handleSubmit}>
                <input className="start__input" autoComplete="off" type="text" name="name" placeholder="Ingrese su nombre" onChange={handleChange} />
                <button className="btn btn-primary btn-block mt-1" type="submit">Ingresar</button>
            </form>
        </div>
    )
}
