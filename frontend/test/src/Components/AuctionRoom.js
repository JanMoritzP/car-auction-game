import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useRouter from './Functions/useRouter'
import SocketIOClient from 'socket.io-client'
import './css/AuctionRoom.css'

export default function AuctionRoom() {
    let { id } = useParams()
    const router = useRouter()

    const [amount, setAmount] = useState(0);
    const [smallestBid, setSmallestBid] = useState(0);
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
            if(data.active === false) router.push('/dashboard')
            setCar(data.car)
            console.log(data.car)
            setPrice(data.price)
            setHighestBidder(data.currentBidder)
            setTimeLeft(data.timeLeft)
            setSmallestBid(data.smallestBid)
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
            if(amount < price + smallestBid) {
                return <button onClick={handleBid} disabled={true}>Bid</button>
            }
            else return <button onClick={handleBid} disabled={false}>Bid</button>
        }
    }

    const highestBidderPar = () => {
        if(highestBidder === position) {
            return <p>You are currently the highest bidder</p>
        }
        else if(highestBidder === 0) {
            return <p>No one has bid on this object yet</p>
        }
        else {
            return <p>Highest Bidder: {highestBidder}</p>
        }
    }

    function getParts(status) {
        if(status.motor === null && status.suspension === null
            && status.transmission === null && status.breaks === null
            && status.paint === null && status.exhaust === null
            && status.wheels === null) {
                return <p>This car does not contain any parts</p>
        }
        var parts = [status.motor, status.suspension, status.transmission, status.breaks, status.paint, status.exhaust, status.wheels]
        for(let i = 0; i < parts.length; i++) {
            if(parts[i] === null) {
                parts.splice(i, 1)
                i--
            }
        }
        console.log(parts)
        return (
            <div>
                {parts.map(part => 
                    <div>
                        <h3>{part.name}</h3>
                        <p>{part.brand}</p>
                        <p>{part.rarity}</p>
                        <p>{part.price}</p>
                    </div>
                )}
            </div>
        )
    }

    function getCarInfo(car) {
        /*
            Display: Name; Brand; Price?; Rarity; Status
            Status: Name; Rarity; Brand; Price?
        */
        if(car === null) return <p>Loading...</p>
        
        return(
            <div>
                <h3>{car.name}</h3>
                <p>{car.brand}</p>
                <p>{car.rarity}</p>
                <p>{car.price}</p>
                <div>
                    {getParts(car.status)}
                </div>
            </div>
        )
    }

    function formatTime(time) {
        var timeString
        if(time < 60) return time + "s"
        else if(time < 3600) {
            if(time%60 !== 0) timeString = Math.floor(time/60).toString() + "m " + time%60 + "s"
            else timeString = Math.floor(time/60).toString() + " m"
            return timeString
        }
        else if(time < 3600*24) {
            var seconds = ""
            var minutes = ""
            var hours
            if(time%60 !== 0) seconds = time%60 + "s" 
            if(Math.floor(time/60)%60 !== 0) minutes = Math.floor(time/60)%60 + "m "
            hours = Math.floor(time/3600) + "h "
            return hours + minutes + seconds
        }
        else return "Much time left"
    }

    return(
        <div>
            <h2 class="auctionRoomHeader">Auction Room</h2>
            <div class="auctionBidWrapper">
                {getCarInfo(car)}
                <p>Current price: {price}</p>
                <p>Smallest increment: {smallestBid}</p>
                <p>Time Left: {formatTime(timeLeft)}</p>
                {highestBidderPar()}
            </div>
            <div class="auctionRoomButtons">
                <button onClick={quickBid} disabled={true}>Quick Bid</button>
                <label>
                    <p>Amount</p>
                    <input type="number" onChange={e => setAmount(e.target.value)} defaultValue="0"/>
                </label>
                {getBidButton()}
                <button onClick={unregister}>Unregister</button>
            </div>
        </div>
    )
}