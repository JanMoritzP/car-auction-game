import React, { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { TestDB } from './Components/TestDB';
import { MainPage } from './Components/MainPage'
import { Inventory } from './Components/Inventory'
import { Shop } from './Components/Shop'
import { Login } from './Components/Login'
import { useToken } from './Hooks/useToken'


function App() {
  const { token, setToken } = useToken()

  
  if(!token) {
    return <Login setToken={setToken}/>
  }
  return (
    <div class="wrapper">
      <h1>Car auction game</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/mainpage">
            <MainPage/>
          </Route>
          <Route path="/inventory">
            <Inventory/>
          </Route>
          <Route path="/shop">
            <Shop/>
          </Route>
        </Switch>
      </BrowserRouter>  
    </div>
  );
}

export default App;
