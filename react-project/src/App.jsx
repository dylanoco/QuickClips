import { useState } from 'react'
import NavBar from './Navbar.jsx'
import ClipsCreated from './ClipsCreated.jsx'
import ViewClip from './ViewClip.jsx'

import './App.css'


function App() {

  return (
  <div className="container"> 
    <NavBar/> 
    <ClipsCreated/> 
    <ViewClip/> 
  </div>
  )
}

export default App
