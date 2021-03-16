import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import './css/ModifyCar.css'

export default function ModifyCar() {

    const { id } = useParams()
    const [parts, setParts] = useState([])
    const [car, setCar] = useState(null)

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
        })
    }

    return(
        <div>
            <h2 class="modifyCarHeader">Modify a Car</h2>
            <button onClick={handleSave}></button>
        </div>
    )
}