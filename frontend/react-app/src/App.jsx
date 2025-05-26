import { useState, useEffect} from 'react'
import NavBar from './Navbar.jsx'
import ClipsCreated from './ClipsCreated.jsx'
import ViewClip from './ViewClip.jsx'
import { io } from 'socket.io-client';
import './App.css'
import { DataProvider } from './DataContext.jsx'

//useState and useEffect to trigger a render to the client, updating the app without needing a manual refresh
function App() {
  socket.on('authenticated', (data) => {
  console.log('User authenticated:', data);
  window.location.reload(); // or refetch user data
});

  
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
