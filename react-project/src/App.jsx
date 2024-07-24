import { useState } from 'react'
import NavBar from './Navbar.jsx'
import ClipsCreated from './ClipsCreated.jsx'
import ViewClip from './ViewClip.jsx'

import './App.css'
import { DataProvider } from './DataContext.jsx'


function App() {

  return (
  <div className="container"> 
    <NavBar/> 
    <DataProvider>
      <ClipsCreated/> 
      <ViewClip/> 
    </DataProvider>
  </div>
  )
}

export default App
