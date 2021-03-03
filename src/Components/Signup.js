import React, { useState } from 'react'

export default function Signup({setToken, setSignup}) {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [checkPassword, setCheckPassword] = useState()
    const [error, setError] = useState(<p></p>)

    async function signup(credentials) {
        return fetch("http://localhost:3080/signup", {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(data=>data.json())
    }

    async function handleSubmit() {
        if(!username) {
            setError(<p>You have to enter a username</p>)
        }
        else if(!password || !checkPassword) {
            setError(<p>You have to enter a password</p>)
        }
        else if(password !== checkPassword) {
            setError(<p>The passwords do not match</p>)
        }
        else {
            setError(<p>Signup should work</p>)
            const data = await signup({username, password})
            setToken(data.token)
            setSignup(false)
        }
    }


    return(
        <div>
            <label>
                <p>Username</p>
                <input type="text" onChange={e => setUsername(e.target.value)}/>
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)}/>
            </label>
            <label>
                <p>Retype Password</p>
                <input type="password" onChange={e => setCheckPassword(e.target.value)}/>
            </label>
            <button onClick={handleSubmit}>Sign up</button>
            {error}
        </div>
    )
}