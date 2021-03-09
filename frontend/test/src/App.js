import React, { useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Inventory from './Components/Inventory'
import Dashboard from './Components/Dashboard'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Admin from './Components/Admin'
import Navbar from './Components/Navbar'
import useToken from './Functions/useToken'

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
            <h1>Car Auction Game</h1>
            <BrowserRouter>
                <Navbar />
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
                </Switch>
            </BrowserRouter>
            <button onClick={logout} style={{position:"absolute", bottom:"2rem", left:"2rem"}}>Logout</button>
        </div>
    )
}

export default App