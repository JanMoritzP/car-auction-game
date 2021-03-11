import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    if(tokenString) {
      const token = checkTokenValidity(tokenString)
      if(token) {
        return token
      }
      else return false
    }
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  async function checkTokenValidity(userToken) {
    const data = await fetch('http://localhost:3080/token', {
        method: "POST",
        body: {token: userToken}
    }).then(res => res.json)
    if(data.valid) {
        return userToken
    }
    else return false
  }

  return {
    setToken: saveToken,
    token
  }
}