import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { SalaJuego } from '../components/batalla/SalaJuego';
import { StartScreen } from '../components/batalla/StartScreen';

export const AppRouter = () => {
    return (
        <Router>
            <div className="start__main">
                <Switch>

                    <Route
                        exact path="/"
                        component={StartScreen}
                    />
                    <Route
                        exact path="/sala"
                        component={SalaJuego}
                    />

                    <Redirect to='/' />

                </Switch>
            </div>
        </Router >
    )
}
