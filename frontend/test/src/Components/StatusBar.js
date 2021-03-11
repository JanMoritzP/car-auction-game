import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import './css/StatusBar.css'
import useRouter from './Functions/useRouter'


export default function StatusBar() {
    const [moneyAmount, setMoneyAmount] = useState(0);
    const [auctions, setAuctions] = useState(0);
    const [claims, setClaims] = useState(0);
    const router = useRouter()

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080", {query: {token: localStorage.getItem("token")}});
        socket.emit("subToStatus", {query: {token: localStorage.getItem("token")}})
        socket.on("getStatus".concat(localStorage.getItem("token").toString()), data => {
            setMoneyAmount(data.money);
            setAuctions(data.auctions);
            setClaims(data.claims);
        });
        return () => {
            socket.emit("unsubFromStatus")
            socket.disconnect()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moneyAmount, auctions, claims]);

    function handleClick(path) {
        router.push(path)
    }

    return(
        <div class="statusbar">
            <button onClick={() => handleClick('/yourClaims')}>Claims: {claims}</button>
            <button onClick={() => handleClick('/yourAuctions')}>Auctions: {auctions}</button>
            <button onClick={() => handleClick('/yourHistory')}>Money: {moneyAmount}</button>            
        </div>
    )
}