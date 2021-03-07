import React from 'react'

export const StartScreen = () => {
    return (

        <div className="start__box-container">
            <h3 className="start__title">Batalla Naval / Reactjs</h3>
            <form>
                <input className="start__input" autoComplete="off" type="text" name="name" placeholder="Ingrese su nombre" />
                <button className="btn btn-primary btn-block mt-1" type="submit">Ingresar</button>
            </form>
        </div>
    )
}
