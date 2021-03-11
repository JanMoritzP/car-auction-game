import React, { useEffect, useState } from 'react'
import SocketIOClient from 'socket.io-client'

export default function YourAuctions() {

    const [info, setInfo] = useState([]);

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080", {query: {token: localStorage.getItem("token"), info: "getAuction"}});
        socket.on("getAuctions", data => {
            setInfo(data);
        });
        return () => {
            socket.emit("auctionUserDisconnects", {token: localStorage.getItem("token")})
            socket.disconnect()
        }
        
    }, []);


    return(
        <div>
            {info.map(info => 
                <div>
                    <p>{info.name}</p>
                    <p>{info.price}</p>
                </div>
            )}
        </div>
    )
}