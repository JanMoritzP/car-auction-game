import React, { useEffect } from 'react'

export const TestDB = () => {
    [postId, setPostId] = useState(null)


    useEffect(() => {
        const requestOptions = {
            method: 'GET'
        }
        fetch('/test', requestOptions)
            .then(response => response.json())
            .then(data => setPostId(data.id))
    }) 

    return(
        <div>
            <p>{postId}</p>
        </div>
    )
}