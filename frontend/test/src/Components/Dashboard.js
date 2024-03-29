import React, { useState, useEffect } from 'react'
import SocketIOClient from 'socket.io-client'
import useRouter from './Functions/useRouter'
import './css/Dashboard.css'

export default function Dashboard({ setToken }) {
    const [info, setInfo] = useState([]);
    const [priority, setPriority] = useState(0);
    const router = useRouter()
    
    useEffect(() => {
        async function getPrio(priority) {
            return await fetch("http://localhost:3080/priority", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"token": localStorage.getItem("token")})
            }).then((res) =>{ 
                if(res.status === 404) setToken(false)
                return res.json()
            })
            .then(json => {
                setPriority(json.priority)
            })
        }

        getPrio(priority);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const socket = SocketIOClient("http://localhost:3080", {query: {token: localStorage.getItem("token")}});
        socket.emit("subToBids", {query: {token: localStorage.getItem("token")}})
        socket.on("getBids".concat(priority.toString()), data => {
            setInfo(data);
        });
        return () => {
            socket.emit("unsubFromBids")
            socket.disconnect()
        }
        
    }, [priority]);

    function handleClick(id) {
        fetch("http://localhost:3080/registerBid", {
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
            else{
                router.push('/auction/'.concat(id.toString()))
            }
        })
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
            <h2 class="dashBoardHeader">Dashboard boiii</h2>
            <div class="bidContainer">
                {info.map(info => 
                <div class="bidDivs" id={info.bid.toString().concat("div")}>
                    <p>{info.car}</p>
                    <p>{info.bidPrice}</p>
                    <p>{formatTime(info.timeLeft)}</p>
                    <button onClick={() => handleClick(info.bid)} id={info.bid} class="bidButtons">Enter auction</button>
                </div>)}
            </div>
        </div>
    )
}