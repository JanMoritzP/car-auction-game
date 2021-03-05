import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import './css/Dashboard.css'

export default function Dashboard() {
    const [bids, setBids] = useState([]);
    const [priority, setPriority] = useState(1)
    
    async function getPrio() {
        const data = await fetch("http://localhost:3080/priority", {
            method: "POST",
            body: {"token": localStorage.getItem("token")}
        }).then((res) =>{ return res.json()})
        .then(json => setPriority(json.priority))
    }
    
    getPrio();

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080");
        socket.on("getBids" + priority.toString(), data => {
            setBids(data);
        });
        return () => socket.disconnect()
    }, []);

    function handleClick(id) {
        console.log(id)
    }


    return(
        <div>
            <h2 class="dashBoardHeader">Dashboard boiii</h2>
            <div class="bidButtonContainer">
                {bids.map(bid => <button onClick={() => handleClick(bid._id)}class="bidButtons">{bid.car}</button>)}
            </div>
        </div>
    )
}