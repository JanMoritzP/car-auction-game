import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useRouter from './Functions/useRouter'
import './css/ModifyCar.css'

export default function ModifyCar() {

    const router = useRouter()
    const { id } = useParams()
    const [parts, setParts] = useState([])
    const [car, setCar] = useState(null)
    const [inv, setInv] = useState([])
    const [wheel1Classes, setWheel1Classes] = useState("wheelsShape1")
    const [wheel2Classes, setWheel2Classes] = useState("wheelsShape2")
    const [wheel1AltClasses, setWheel1AltClasses] = useState("wheelsShape1Alt")
    const [wheel2AltClasses, setWheel2AltClasses] = useState("wheelsShape2Alt")

    useEffect(() => {
        fetch('http://localhost:3080/getCarInfo', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id: id
            })
        }).then(res => {
            if(res.status !== 200) console.log(res.message)
            else {
                setCar(res.car)
                setParts(res.parts)
            }
        })
    }, [id])

    function handleSave() {
        fetch('http://localhost:3080/setCarInfo', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                car: car,
                parts: parts
            })
            .then(res => {
                if(res.status === 200) console.log("saved")
            })
        })
    }

    function handleClick(type) {
        fetch('http://localhost:3080/getInventory', {
            method: "POST",
            headers: {
                'Contenty-Type': 'json/application'
            },
            body: {
                id: localStorage.getItem("token"),
                option: "parts"
            }})
            .then(res => res.json())
            .then(data => {
                setInv(data.data.filter(part => part.name === type))
            })
    }

    function switchPart(part, type) {
        var found = false
        var tmpParts = parts
        for(let i = 0; i < tmpParts.length; i++) {
            if(parts.name === type) {
                found = true
                tmpParts[i] = part
                setParts(tmpParts)
            }
        }
        if(!found) {
            tmpParts.push(part)
            setParts(tmpParts)
        }
    }

    function handleHover(type) {
        if(type === "wheels") {
            setWheel1Classes("wheelsShape1 wheelsHover")
            setWheel2Classes("wheelsShape2 wheelsHover")
            setWheel1AltClasses("wheelsShape1Alt altWheelsHover")
            setWheel2AltClasses("wheelsShape2Alt altWheelsHover")
        }

    }

    function deHandleHover(type) {
        if(type === "wheels") {
            setWheel1Classes("wheelsShape1")
            setWheel2Classes("wheelsShape2")
            setWheel1AltClasses("wheelsShape1Alt")
            setWheel2AltClasses("wheelsShape2Alt")            
        }
    }

    return(
        <div>
            <h2 class="modifyCarHeader">Modify a Car</h2>
            <div class="carShape">
                <div class="motorShape" onClick={() => handleClick("motor")} onMouseEnter={() => handleHover("motor")} onMouseLeave={() => deHandleHover("motor")}></div>
                <div class="motorShapeAlt" onClick={() => handleClick("motor")} onMouseEnter={() => handleHover("motor")} onMouseLeave={() => deHandleHover("motor")}></div>
                
                <div class="suspensionShape" onClick={() => handleClick("suspension")}></div>
                <div class="suspensionShapeAlt" onClick={() => handleClick("suspension")}></div>
                
                <div class="paintShape" onClick={() => handleClick("paint")}></div>
                <div class="paintShapeAlt" onClick={() => handleClick("paint")}></div>

                <div class="transmissionShape" onClick={() => handleClick("transmission")}></div>
                <div class="transmissionShapeAlt" onClick={() => handleClick("transmission")}></div>
                
                <div class="exhaustShape" onClick={() => handleClick("exhaust")}></div>
                <div class="exhaustShapeAlt" onClick={() => handleClick("exhaust")}></div>
                
                <div class="breaksShape" onClick={() => handleClick("breaks")}></div>
                <div class="breaksShapeAlt" onClick={() => handleClick("breaks")}></div>

                <div class={wheel1Classes} onClick={() => handleClick("wheels")} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel1AltClasses} onClick={() => handleClick("wheels")} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel2Classes} onClick={() => handleClick("wheels")} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel2AltClasses} onClick={() => handleClick("wheels")} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
            </div>
            <div class="modifyCarContextMenu">
                {inv.map(part => 
                    <div onClick={() => switchPart(part, part.name)}>
                        <p>{part.name}</p>
                        <p>{part.price}</p>
                        <p>{part.rarity}</p> 
                    </div>
                    )}
            </div>
            
            <button onClick={handleSave} class="modifyCarSaveButton">Save</button>
            <button onClick={() => router.push('/inventory')} class="modifyCarBackButton">Back</button>
        </div>
    )
}