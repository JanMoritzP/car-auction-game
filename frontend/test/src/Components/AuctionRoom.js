import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useRouter from './Functions/useRouter'
import SocketIOClient from 'socket.io-client'
import './css/AuctionRoom.css'

export default function AuctionRoom() {
    let { id } = useParams()
    const router = useRouter()

    const [amount, setAmount] = useState(0);
    const [car, setCar] = useState(null);
    const [price, setPrice] = useState(0);
    const [highestBidder, setHighestBidder] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3080/auctionValidation", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: id
            })
        }).then(res => {
            if(res.status !== 200) router.push('/dashboard')
            else {

            }
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        //const socket = SocketIOClient("http://localhost:3080");
        //socket.on("getBids".concat(priority.toString()), data => {
        //    setInfo(data);
        //});
        //return () => socket.disconnect()

    }, [])

    function quickBid() {
        console.log("quickBid lol")
    }

    function handleBid() {
        console.log(amount)
    }

    function unregister() {
        fetch("http://localhost:3080/unregisterBid", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                token: localStorage.getItem("token")
            })
        })
        .then(res => {
            if(res.status !== 200) console.log(res.message)
            else {
                router.push("/dashboard")
            }
        })
    }


    return(
        <div>
            <h2 class="auctionRoomHeader">Auction Room</h2>
            <div class="auctionBidWrapper">
                <p>Currently bidding on {car}</p>
                <p>Current price: {price}</p>
                <p>Highest Bidder: {highestBidder}</p>
            </div>
            <div class="auctionRoomButtons">
                <button onClick={quickBid}>Quick Bid</button>
                <label>
                    <p>Amount</p>
                    <input type="text" onChange={e => setAmount(e.target.value)} defaultValue="0"/>
                </label>
                <button onClick={handleBid}>Bid</button>
                <button onClick={unregister}>Unregister</button>
            </div>
        </div>
    )
}