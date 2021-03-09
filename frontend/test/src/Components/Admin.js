import React, { useState } from 'react'
import './css/Admin.css'

export default function Admin() {

    const [priority, setPriority] = useState(1)
    const [maxBidders, setMaxBidders] = useState(0);
    const [maxWatchers, setMaxWatchers] = useState(0);
    const [name, setName] = useState("Car");
    const [basePrice, setBasePrice] = useState(0);
    const [rarity, setRarity] = useState(0)
    const [timeLeft, setTimeLeft] = useState(100)
    const [timeIncrement, setTimeIncrement] = useState(10)
    const [incrementBound, setIncrementBound] = useState(10)
    const [motorRarity, setMotorRarity] = useState(0);
    const [motorPrice, setMotorPrice] = useState(0)
    const [suspensionRarity, setSuspensionRarity] = useState(0);
    const [suspensionPrice, setSuspensionPrice] = useState(0)
    const [transmissionRarity, setTransmissionRarity] = useState(0);
    const [transmissionPrice, setTransmissionPrice] = useState(0)
    const [exhaustRarity, setExhaustRarity] = useState(0);
    const [exhaustPrice, setExhaustPrice] = useState(0)
    const [breaksRarity, setBreaksRarity] = useState(0);
    const [breaksPrice, setBreaksPrice] = useState(0)
    const [paintRarity, setPaintRarity] = useState(0);
    const [paintPrice, setPaintPrice] = useState(0)
    const [wheelsRarity, setWheelsRarity] = useState(0);
    const [wheelsPrice, setWheelsPrice] = useState(0);


    async function accessAPI(bid) {
        return fetch("http://localhost:3080/createBid", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bid)
        })
        .then(data => data.json())
    }


    async function addBid() {
    
        const bid = {
            "bid": {
                "priority": priority,
                "maxBidders": maxBidders,
                "maxWatchers": maxWatchers,
                "price": basePrice,
                "timeLeft": timeLeft,
                "timeIncrement": timeIncrement,
                "incrementBound": incrementBound
            },
            "car": {
                "name": name,
                "rarity": rarity
            },
            "parts": {
                "name": ['motor', 'suspension', 'transmission', 'exhaust', 'breaks', 'paint', 'wheels'],
                "rarity": [motorRarity, suspensionRarity, transmissionRarity, exhaustRarity, breaksRarity, paintRarity, wheelsRarity],
                "price": [motorPrice, suspensionPrice, transmissionPrice, exhaustPrice, breaksPrice, paintPrice, wheelsPrice]
            }
            
        }
        const newBid = await accessAPI(bid)
        console.log(newBid)
    }


    return(
        <div>
            <h2>Admin</h2>
            <label>
                <p>Priority</p>
                <input type="text" defaultValue="1" onChange={e => setPriority(e.target.value)}/>
            </label>
            <label>
                <p>Max Bidders</p>
                <input type="text" defaultValue="20" onChange={e => setMaxBidders(e.target.value)}/>
            </label>
            <label>
                <p>Max Watchers</p>
                <input type="text" defaultValue="20" onChange={e => setMaxWatchers(e.target.value)}/>
            </label>
            <label>
                <p>Name</p>
                <input type="text" defaultValue="Car" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <p>Base price</p>
                <input type="text" defaultValue="0" onChange={e => setBasePrice(e.target.value)}/>
            </label>
            <label>
            <label>
                <p>Rarity</p>
                <input type="text" defaultValue="0" onChange={e => setRarity(e.target.value)}/>
            </label>
                <p>Time Left</p>
                <input type="text" defaultValue="100" onChange={e => setTimeLeft(e.target.value)}/>
            </label>
            <label>
                <p>Time Increment</p>
                <input type="text" defaultValue="10" onChange={e => setTimeIncrement(e.target.value)}/>
            </label>
            <label>
                <p>Increment bound</p>
                <input type="text" defaultValue="10" onChange={e => setIncrementBound(e.target.value)}/>
            </label>
            <div class="parts">
                <div class="part">
                    <p>Motor</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setMotorRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setMotorPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Suspension</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setSuspensionRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setSuspensionPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Transmission</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setTransmissionRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setTransmissionPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Exhaust</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setExhaustRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setExhaustPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Breaks</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setBreaksRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setBreaksPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Paint</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setPaintRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setPaintPrice(e.target.value)}/>
                    </label>
                </div>
                <div class="part">
                    <p>Wheels</p>
                    <label>
                        <p>Rarity</p>
                        <input type="text" defaultValue="0" onChange={e => setWheelsRarity(e.target.value)}/>
                    </label>
                    <label>
                        <p>Price</p>
                        <input type="text" defaultValue="0" onChange={e => setWheelsPrice(e.target.value)}/>
                    </label>
                </div>
            </div>
            <button onClick={addBid}>Add bid</button>
        </div>
    )
}