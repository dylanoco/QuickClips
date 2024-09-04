import { useState, useEffect} from 'react'
import NavBar from './Navbar.jsx'
import ClipsCreated from './ClipsCreated.jsx'
import ViewClip from './ViewClip.jsx'
import { io } from 'socket.io-client';
import './App.css'
import { DataProvider } from './DataContext.jsx'

//useState and useEffect to trigger a render to the client, updating the app without needing a manual refresh
function App() {
  
  const [response, setResponse] = useState('');
  useEffect(() => {
    const socket = io('http://localhost:5000') //Connects to Backend via SocketIO. Communicates through 'refresh-clips' channel
    socket.on('refresh-clips', (data) => {
        setResponse(data.data);
        console.log(data.data);
        });
    }, [response]);
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
