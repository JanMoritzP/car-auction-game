import React, { useState } from 'react'
import PropTypes from 'prop-types'

async function loginUser(credentials) {
    return fetch('http://localhost:3080/login', {
    method: 'POST',
    body: JSON.stringify(credentials)})
    .then(data => data.json())
}



export const Login = ({ setToken }) => {
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault()
        const token = await loginUser({
            username,
            password
        })
        console.log(token)
        setToken(token)
    }

    return(
        <div>
            <h2>Please log in</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )    
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}