import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Inventory from './Components/Inventory'
import Dashboard from './Components/Dashboard'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Admin from './Components/Admin'
import Navbar from './Components/Navbar'
import StatusBar from './Components/StatusBar'
import AuctionRoom from './Components/AuctionRoom'
import YourAuctions from './Components/YourAuctions';
import YourClaims from './Components/YourClaims';
import ModifyCar from './Components/ModifyCar'
import useToken from './Components/Functions/useToken'

import './Components/css/App.css'

function App() {

    const { token, setToken } = useToken()
    const [signup, setSignup] = useState(false)

    function logout() {
        setToken(false)
        localStorage.clear()
    }

    if(signup) {
        return <Signup setToken={setToken} setSignup={setSignup}/>
    }

    if(!token) {
        return <Login setToken={setToken} setSignup={setSignup}/>
    }

    return(
        <div class="wrapper">
            <h1 class="header">Car Auction Game</h1>
            <BrowserRouter>
                <Navbar />
                <StatusBar />
                <Switch>
                    <Route path="/dashboard">
                        <Dashboard setToken={setToken}/>
                    </Route>
                    <Route path="/inventory">
                        <Inventory setToken={setToken}/>
                    </Route>
                    <Route path="/admin">
                        <Admin />
                    </Route>
                    <Route path="/auction/:id">
                        <AuctionRoom />
                    </Route>
                    <Route path="/yourAuctions">
                        <YourAuctions />
                    </Route>
                    <Route path="/yourClaims">
                        <YourClaims />
                    </Route>
                    <Route path="/modifyCar/:id">
                        <ModifyCar />
                    </Route>
                </Switch>
            </BrowserRouter>
            <button onClick={logout} style={{position:"absolute", bottom:"2rem", left:"2rem"}}>Logout</button>
        </div>
    )
}

export default App