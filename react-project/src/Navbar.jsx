import { useState } from 'react'
import './Navbar.css'

function NavBar() {

  return (
    <div className='navbar'>
      <header>Twitch Clips</header>
      <ul className='navbar-ul'>
        <li><a>Home</a></li>
        <li><a>View Clips</a></li>
      </ul>
    </div>
    )
}

export default NavBar