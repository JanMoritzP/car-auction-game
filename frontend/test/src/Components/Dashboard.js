import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import './css/Dashboard.css'

export default function Dashboard({ setToken }) {
    const [info, setInfo] = useState([]);
    const [priority, setPriority] = useState(0);
    
    useEffect(() => {
        async function getPrio(priority) {
            return await fetch("http://localhost:3080/priority", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"token": localStorage.getItem("token")})
            }).then((res) =>{ 
                if(res.status === 404) setToken(false)
                return res.json()
            })
            .then(json => {
                setPriority(json.priority)
            })
        }

        getPrio(priority);
    }, [])

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080");
        socket.on("getBids".concat(priority.toString()), data => {
            console.log(data)
            setInfo(data);
        });
        return () => socket.disconnect()
        
    }, [priority]);

    function handleClick(id) {
        console.log(id)
    }


    return(
        <div>
            <h2 class="dashBoardHeader">Dashboard boiii</h2>
            <div class="bidButtonContainer">
                {info.map(info => <button onClick={() => handleClick(info.bid)}class="bidButtons">{info.car}</button>)}
            </div>
        </div>
    )
}