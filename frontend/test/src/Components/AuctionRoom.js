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
    const [timeLeft, setTimeLeft] = useState(100);
    const [position, setPosition] = useState(0);


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
        })
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080");
        socket.emit("joinAuctionRoom", {id: id, token: localStorage.getItem("token")})
        socket.on(localStorage.getItem("token"), data => {
            setPosition(data + 1)
        })
        socket.on("auctionRoom".concat(id), data => {
            setCar(data.car)
            setPrice(data.price)
            setHighestBidder(data.currentBidder)
            setTimeLeft(data.timeLeft)
        })
        return () => {
            socket.emit("leaveAuctionRoom", id)
            socket.disconnect()
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function quickBid() {
        console.log("quickBid lol")
    }

    function handleBid() {
        fetch("http://localhost:3080/placeBid", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomId: id,
                amount: amount,
                token: localStorage.getItem("token")
            })
        }).then(res => {
            if(res.status !== 200) console.log(res.message)
        })
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

    const getBidButton = () => {
        if(amount <= price) {
            return <button onClick={handleBid} disabled={true}>Bid</button>
        }
        else {
            return <button onClick={handleBid} disabled={false}>Bid</button>
        }
    }

    const highestBidderPar = () => {
        if(highestBidder === position) {
            return <p>You are currently the highest bidder</p>
        }
        else {
            return <p>Highest Bidder: {highestBidder}</p>
        }
    }

    return(
        <div>
            <h2 class="auctionRoomHeader">Auction Room</h2>
            <div class="auctionBidWrapper">
                <p>Currently bidding on: {car}</p>
                <p>Current price: {price}</p>
                <p>Time Left: {timeLeft}</p>
                {highestBidderPar()}
            </div>
            <div class="auctionRoomButtons">
                <button onClick={quickBid} disabled={true}>Quick Bid</button>
                <label>
                    <p>Amount</p>
                    <input type="text" onChange={e => setAmount(e.target.value)} defaultValue="0"/>
                </label>
                {getBidButton()}
                <button onClick={unregister}>Unregister</button>
            </div>
        </div>
    )
}