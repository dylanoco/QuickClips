import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './Navbar.css'

function NavBar() {

  return (
    <div className='navbar'>
      <ul>
        <header>Twitch Clips</header>
        <li><a>Home</a></li>
        <li><a>View Clips</a></li>
      </ul>
    </div>
    )
}

export default NavBar