import React, { useEffect, useState } from 'react'
import SocketIOClient from 'socket.io-client'
import useRouter from './Functions/useRouter'
import './css/YourAuctions.css'

export default function YourAuctions() {

    const [info, setInfo] = useState([]);

    const router = useRouter();

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080", {query: {token: localStorage.getItem("token")}});
        socket.emit("subToUserAuctions", {query: {token: localStorage.getItem("token")}})
        socket.on("getAuctions".concat(localStorage.getItem("token")), data => {
            setInfo(data);
        });
        return () => {
            socket.emit("unsubFromUserAuctions")
            socket.disconnect()
        }
        
    }, []);

    function handleClick(id) {
        router.push('/auction/'.concat(id))
    }

    return(
        <div class="yourAuctionsWrapper">
            {info.map(info => 
                <div class="yourAuctionsCards" onClick={() => handleClick(info.id)}>
                    <p>{info.name}</p>
                    <p>{info.price}</p>
                </div>
            )}
        </div>
    )
}