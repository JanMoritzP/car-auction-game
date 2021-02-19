import React, { useEffect, useState } from 'react'

export const TestDB = () => {
    const [postId, setPostId] = useState(null)


    useEffect(() => {
        const requestOptions = {
            method: 'GET'
        }
        fetch('http://localhost:3080/test', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setPostId(data.id)
            })
    }, []) 

    return(
        <div>
            <p>PostId: {JSON.stringify(postId)}</p>
        </div>
    )
}