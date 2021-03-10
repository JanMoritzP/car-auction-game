import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import './css/StatusBar.css'


export default function StatusBar() {
    const [moneyAmount, setMoneyAmount] = useState(0);
    const [auctions, setAuctions] = useState(0);
    const [claims, setClaims] = useState(0);

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080");
        socket.on("getStatus".concat(localStorage.getItem("token").toString()), data => {
            setMoneyAmount(data.money);
            setAuctions(data.auctions);
            setClaims(data.claims);
        });
        return () => socket.disconnect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moneyAmount, auctions, claims]);



    return(
        <div class="statusbar">
            <button>Claims: {claims}</button>
            <button>Auctions: {auctions}</button>
            <button>Money: {moneyAmount}</button>            
        </div>
    )
}