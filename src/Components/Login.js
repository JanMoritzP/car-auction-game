import React, { useState } from 'react'
import PropTypes from 'prop-types'
export default function Login({setToken, setSignup}) {
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [error, setError] = useState(<p></p>);

    async function loginUser(credentials) {
        return fetch("http://localhost:3080/login", {
            method: "POST", 
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
        .then(data => data.json())
    }


    const handleSubmit = async e =>  {
        e.preventDefault()
        if(!username) {
            setError(<p>You have to enter a username</p>)
            return
        }
        else if(!password) {
            setError(<p>You have to enter a password</p>)
            return
        }
        const token = await loginUser({
            username,
            password
        })
        if(token.token) {
            setToken(token.token)
        }
        else {
            setError(<p>Wrong Username or Password</p>)
        }
    }

    function handleSignup() {
        setSignup(true)
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)} />
                </label>   
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit">Login</button>
                </div>
                {error}
            </form>
            <button onClick={handleSignup}>Signup</button>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}