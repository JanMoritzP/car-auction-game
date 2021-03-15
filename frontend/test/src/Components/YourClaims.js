import React, { useEffect, useState } from 'react'
import SocketIOClient from 'socket.io-client'
//import useRouter from './Functions/useRouter'
import './css/YourClaims.css'

export default function YourAuctions() {

    const [info, setInfo] = useState([]);

    //const router = useRouter();

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080", {query: {token: localStorage.getItem("token")}});
        socket.emit("subToUserClaims", {query: {token: localStorage.getItem("token")}})
        socket.on("getClaims".concat(localStorage.getItem("token")), data => {
            setInfo(data);
            console.log(data)
        });
        return () => {
            socket.emit("unsubFromUserClaims")
            socket.disconnect()
        }
        
    }, [info]);

    function handleClick(id) {
        fetch("http://localhost:3080/claimAuction", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                token: localStorage.getItem("token")
            })
        })
    }

    function dispClaims() {
        if(info.length > 0) {
            return (
                <div>
                    {info.map(info => 
                        <div class="yourClaimsCards" >
                            <p>{info.name}</p>
                            <p>{info.price}</p>
                            <button onClick={() => handleClick(info.id)}>Claim</button>
                        </div>
                    )}
                </div>
            )
        }
    }

    return(
        <div class="yourClaimsWrapper">
            {dispClaims()}
        </div>
    )
}