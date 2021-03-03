import React, { useState } from 'react'

export default function Admin() {

    const [priority, setPriority] = useState()
    const [maxBidders, setMaxBidders] = useState();
    const [maxWatchers, setMaxWatchers] = useState();
    const [name, setName] = useState();
    const [basePrice, setBasePrice] = useState();
    const [motor, setMotor] = useState(false);
    const [exhaust, setExhaust] = useState(false);
    const [paint, setPaint] = useState(false);
    const [suspension, setSuspension] = useState(false);
    const [gearing, setGearing] = useState(false);
    const [error, setError] = useState(<p></p>);


    async function accessAPI(bid) {
        return fetch("http://localhost:3080/createBid", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                query: "TestQuery"
            },
            body: JSON.stringify(bid)
        })
        .then(data => data.json())
    }


    async function addBid() {
        if(!priority || !maxBidders || !maxWatchers || !name || !basePrice) {
            setError(<p>You have to write something in all input fields</p>)
        }
        else {
            const bid = {
                priority: priority,
                maxBidders: maxBidders,
                maxWatchers: maxWatchers,
                object: {
                    name: name,
                    basePrice: basePrice,
                    status: {
                        motor: motor,
                        exhaust: exhaust,
                        paint: paint,
                        suspension: suspension,
                        gearing: gearing
                    }
                }
            }
            const newBid = await accessAPI(bid)
            console.log(newBid)
        }
    }


    return(
        <div>
            <h2>Admin</h2>
            <label>
                <p>Priority</p>
                <input type="text" onChange={e => setPriority(e.target.value)}/>
            </label>
            <label>
                <p>Max Bidders</p>
                <input type="text" onChange={e => setMaxBidders(e.target.value)}/>
            </label>
            <label>
                <p>Max Watchers</p>
                <input type="text" onChange={e => setMaxWatchers(e.target.value)}/>
            </label>
            <label>
                <p>Name</p>
                <input type="text" onChange={e => setName(e.target.value)}/>
            </label>
            <label>
                <p>Base price</p>
                <input type="text" onChange={e => setBasePrice(e.target.value)}/>
            </label>
            <label>
                <p>Motor</p>
                <input type="checkbox" onChange={e => setMotor(e.target.checked)}/>
            </label>
            <label>
                <p>Exhaust</p>
                <input type="checkbox" onChange={e => setExhaust(e.target.checked)}/>
            </label>
            <label>
                <p>Paint</p>
                <input type="checkbox" onChange={e => setPaint(e.target.checked)}/>
            </label>
            <label>
                <p>Suspension</p>
                <input type="checkbox" onChange={e => setSuspension(e.target.checked)}/>
            </label>
            <label>
                <p>Gearing</p>
                <input type="checkbox" onChange={e => setGearing(e.target.checked)}/>
            </label>
            <button onClick={addBid}>Add bid</button>
            {error}
        </div>
    )
}