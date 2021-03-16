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
    const [contextMenuClasses, setContextMenuClasses] = useState("modifyCarContextMenu")
    const [wheel1Classes, setWheel1Classes] = useState("wheelsShape1")
    const [wheel2Classes, setWheel2Classes] = useState("wheelsShape2")
    const [wheel1AltClasses, setWheel1AltClasses] = useState("wheelsShape1Alt")
    const [wheel2AltClasses, setWheel2AltClasses] = useState("wheelsShape2Alt")
    const [motorClasses, setMotorClasses] = useState("motorShape")
    const [motorAltClasses, setMotorAltClasses] = useState("motorShapeAlt")
    const [suspensionClasses, setSuspensionClasses] = useState("suspensionShape")
    const [suspensionAltClasses, setSuspensionAltClasses] = useState("suspensionShapeAlt")
    const [paintClasses, setPaintClasses] = useState("paintShape")
    const [paintAltClasses, setPaintAltClasses] = useState("paintShapeAlt")
    const [exhaustClasses, setExhaustClasses] = useState("exhaustShape")
    const [exhaustAltClasses, setExhaustAltClasses] = useState("exhaustShapeAlt")
    const [transmissionClasses, setTransmissionClasses] = useState("transmissionShape")
    const [transmissionAltClasses, setTransmissionAltClasses] = useState("transmissionShapeAlt")
    const [brakesClasses, setBrakesClasses] = useState("brakesShape")
    const [brakesAltClasses, setBrakesAltClasses] = useState("brakesShapeAlt")

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

    function handleClick(type, number) {
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
            setContextMenuClasses("modifyCarContextMenu modifyCarContextMenuClicked")
            adjustContextMenuPosition(type, number)
    }

    function adjustContextMenuPosition(type, number) {
        if(type === "wheels") {
            if(number === 1) {
                document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "34%"
                document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "37%"
            }
            else if(number === 2) {
                document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "57%"
                document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "37%"
            }
        }
        else if(type === "motor") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "62%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "46%"            
        }
        else if(type === "transmission") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "53%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "45%"
        }
        else if(type === "exhaust") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "26%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "42%"
        }
        else if(type === "suspension") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "47%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "45%"
        }
        else if(type === "paint") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "45%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "65%"            
        }
        else if(type === "brakes") {
            document.getElementsByClassName("modifyCarContextMenu")[0].style.left = "39%"
            document.getElementsByClassName("modifyCarContextMenu")[0].style.bottom = "43%"
        }
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
            setWheel1Classes("wheelsShape1 partsHover")
            setWheel2Classes("wheelsShape2 partsHover")
            setWheel1AltClasses("wheelsShape1Alt altPartsHover")
            setWheel2AltClasses("wheelsShape2Alt altPartsHover")
        }
        else if(type === "motor") {
            setMotorClasses("motorShape partsHover")
            setMotorAltClasses("motorShapeAlt altPartsHover")
        }
        else if(type === "transmission") {
            setTransmissionClasses("transmissionShape partsHover")
            setTransmissionAltClasses("transmissionShapeAlt altPartsHover")
        }
        else if(type === "exhaust") {
            setExhaustClasses("exhaustShape partsHover")
            setExhaustAltClasses("exhaustShapeAlt altPartsHover")
        }
        else if(type === "suspension") {
            setSuspensionClasses("suspensionShape partsHover")
            setSuspensionAltClasses("suspensionShapeAlt altPartsHover")
        }
        else if(type === "paint") {
            setPaintClasses("paintShape partsHover")
            setPaintAltClasses("paintShapeAlt altPartsHover")            
        }
        else if(type === "brakes") {
            setBrakesClasses("brakesShape partsHover")
            setBrakesAltClasses("brakesShapeAlt altPartsHover")
        }

    }

    function deHandleHover(type) {
        if(type === "wheels") {
            setWheel1Classes("wheelsShape1")
            setWheel2Classes("wheelsShape2")
            setWheel1AltClasses("wheelsShape1Alt")
            setWheel2AltClasses("wheelsShape2Alt")            
        }
        else if(type === "motor") {
            setMotorClasses("motorShape")
            setMotorAltClasses("motorShapeAlt")
        }
        else if(type === "transmission") {
            setTransmissionClasses("transmissionShape")
            setTransmissionAltClasses("transmissionShapeAlt")
        }
        else if(type === "exhaust") {
            setExhaustClasses("exhaustShape")
            setExhaustAltClasses("exhaustShapeAlt")
        }
        else if(type === "suspension") {
            setSuspensionClasses("suspensionShape")
            setSuspensionAltClasses("suspensionShapeAlt")
        }
        else if(type === "paint") {
            setPaintClasses("paintShape")
            setPaintAltClasses("paintShapeAlt")            
        }
        else if(type === "brakes") {
            setBrakesClasses("brakesShape")
            setBrakesAltClasses("brakesShapeAlt")
        }
    }

    return(
        <div>
            <h2 class="modifyCarHeader">Modify a Car</h2>
            <div class="carShape">
                <div class={motorClasses} onClick={() => handleClick("motor", 0)} onMouseEnter={() => handleHover("motor")} onMouseLeave={() => deHandleHover("motor")}></div>
                <div class={motorAltClasses} onClick={() => handleClick("motor", 0)} onMouseEnter={() => handleHover("motor")} onMouseLeave={() => deHandleHover("motor")}></div>
                
                <div class={suspensionClasses} onClick={() => handleClick("suspension", 0)} onMouseEnter={() => handleHover("suspension")} onMouseLeave={() => deHandleHover("suspension")}></div>
                <div class={suspensionAltClasses} onClick={() => handleClick("suspension", 0)} onMouseEnter={() => handleHover("suspension")} onMouseLeave={() => deHandleHover("suspension")}></div>
                
                <div class={paintClasses} onClick={() => handleClick("paint", 0)} onMouseEnter={() => handleHover("paint")} onMouseLeave={() => deHandleHover("paint")}></div>
                <div class={paintAltClasses} onClick={() => handleClick("paint", 0)} onMouseEnter={() => handleHover("paint")} onMouseLeave={() => deHandleHover("paint")}></div>

                <div class={transmissionClasses} onClick={() => handleClick("transmission", 0)} onMouseEnter={() => handleHover("transmission")} onMouseLeave={() => deHandleHover("transmission")}></div>
                <div class={transmissionAltClasses} onClick={() => handleClick("transmission", 0)} onMouseEnter={() => handleHover("transmission")} onMouseLeave={() => deHandleHover("transmission")}></div>
                
                <div class={exhaustClasses} onClick={() => handleClick("exhaust", 0)} onMouseEnter={() => handleHover("exhaust")} onMouseLeave={() => deHandleHover("exhaust")}></div>
                <div class={exhaustAltClasses} onClick={() => handleClick("exhaust", 0)} onMouseEnter={() => handleHover("exhaust")} onMouseLeave={() => deHandleHover("exhaust")}></div>
                
                <div class={brakesClasses} onClick={() => handleClick("brakes", 0)} onMouseEnter={() => handleHover("brakes")} onMouseLeave={() => deHandleHover("brakes")}></div>
                <div class={brakesAltClasses} onClick={() => handleClick("brakes", 0)} onMouseEnter={() => handleHover("brakes")} onMouseLeave={() => deHandleHover("brakes")}></div>

                <div class={wheel1Classes} onClick={() => handleClick("wheels", 1)} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel1AltClasses} onClick={() => handleClick("wheels", 1)} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel2Classes} onClick={() => handleClick("wheels", 2)} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
                <div class={wheel2AltClasses} onClick={() => handleClick("wheels", 2)} onMouseEnter={() => handleHover("wheels")} onMouseLeave={() => deHandleHover("wheels")}></div>
            </div>
            <div class={contextMenuClasses}>
                {inv.map(part => 
                    <div onClick={() => switchPart(part, part.name)}>
                        <p>{part.name}</p>
                        <p>{part.price}</p>
                        <p>{part.rarity}</p> 
                    </div>
                    )}
                <button onClick={() => setContextMenuClasses("modifyCarContextMenu")}>X</button>
            </div>
            
            <button onClick={handleSave} class="modifyCarSaveButton">Save</button>
            <button onClick={() => router.push('/inventory')} class="modifyCarBackButton">Back</button>
        </div>
    )
}