import React from 'react'
import './css/Navbar.css'
import useRouter from './Functions/useRouter'
// Usage
export default function Navbar() {
    // Get the router object
    const router = useRouter();

    // Get value from query string (?postId=123) or route param (/:postId)
    //console.log(router.query.postId);
    // Get current pathname
    //console.log(router.pathname)
    // Navigate with with router.push()

    

    return (
        <div class="navbar">
            <button onClick={(e) => router.push('/admin')}>Admin</button>
            <button onClick={(e) => router.push('/inventory')}>Inventory</button>
            <button onClick={(e) => router.push('/dashboard')}>Dashboard</button>
        </div>

    );

}
