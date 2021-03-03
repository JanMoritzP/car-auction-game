import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import './css/Dashboard.css'

export default function Dashboard() {
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080");
        socket.on("getBids", data => {
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
                {bids.map(bid => <button onClick={() => handleClick(bid._id)}class="bidButtons">{bid.object.name}</button>)}
            </div>
        </div>
    )
}