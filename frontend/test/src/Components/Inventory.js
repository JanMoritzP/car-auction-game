import React, { useEffect, useState } from 'react'
import './css/Inventory.css'

export default function Inventory() {

    const [cars, setCars] = useState([]);
    const [parts, setParts] = useState([]);
    const [misc, setMisc] = useState([])
    const [showPartsInCars, setShowPartsInCars] = useState(false);
    const [option, setOption] = useState("cars")

    useEffect(() => {
        fetch("http://localhost:3080/getInventory",  {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                option: option
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(option === "cars") {
                setCars(data.data)
            }
            else if(option === "parts") {
                setParts(data.data)
            }
            else if(option === "misc") {
                setMisc(data.data)
            }
        })
    }, [option]);


    function getInventory() {
        if(option === "cars") {
            return (
                <div class="mainInvDiv">
                    {cars.map(car => 
                        <div class="invCars">
                            <p>{car.name}</p>
                            <p>{car.price}</p>
                            <p>{car.rarity}</p>
                        </div>
                        )}
                </div>
            )
        }

        if(option === "parts") {
            return (
                <div class="mainInvDiv">
                    {parts.map(part => {
                        if(part.usedIn === null || showPartsInCars) {
                            return(
                                <div class="invParts">
                                    <p>{part.name}</p>
                                    <p>{part.price}</p>
                                    <p>{part.rarity}</p>                            
                                </div>
                            )
                        }
                        return null
                    })}
                </div>
            )
        }
    
        if(option === "misc") {
            return (
                <div class="mainInvDiv">
                    {misc.map(misc => 
                        <div class="invMisc">
                            <p>Misc</p>
                        </div>
                    )}
                </div>
            )
        }

    }


    return(
        <div>
            <h2 class="inventoryHeader">Inventory</h2>
            <div class="invCheckBoxDiv">
                <input type="checkbox" onChange={e => setShowPartsInCars(e.target.checked)}/>
                <label>Also show parts used in cars?</label>
            </div>
            <div class="invOptionDiv">
                <button onClick={() => setOption("cars")}>Cars</button>
                <button onClick={() => setOption("parts")}>Parts</button>
                <button onClick={() => setOption("misc")}>Misc</button>
            </div>
            {getInventory()}
        </div>
        
    )
}