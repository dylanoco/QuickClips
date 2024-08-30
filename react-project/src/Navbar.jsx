import { useState, useEffect } from 'react';
import './Navbar.css';
import { io } from 'socket.io-client';
// import socket from './socket'; // Import your Socket.IO client instance


function NavBar() {
  const [profile, setProfile] = useState('');
  const [authStatus, setAuthStatus] = useState('Checking authentication...');
  const [response, setResponse] = useState('');

  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false); // Track if we are recording keys
  const [shortcuts, setShortcuts] = useState(); // Store recorded shortcuts



  useEffect(() => {
    const socket = io('http://localhost:5000')
    const detectKeyDown = (event) => {
      if (isRecording) {
        const key = event.key.toLowerCase(); // Normalize key to lowercase
        setPressedKeys((prevKeys) => new Set(prevKeys).add(key));
        // Add the pressed key to the set
      }
    };

    const detectKeyUp = (event) => {
      if (isRecording) {
        const key = event.key.toLowerCase(); // Normalize key to lowercase
        setPressedKeys((prevKeys) => {
          const newKeys = new Set(prevKeys); // Create a new set from the previous keys
          console.log(isRecording)
          // Check if all keys have been released
          saveShortcut(prevKeys); // Save the current shortcut
          console.log("Test Stop Recording")
          stopRecording(); // Stop recording after saving
          document.removeEventListener('keyup', detectKeyUp, true);
          newKeys.clear; // Remove the released key#
          return newKeys; // Return the updated keys
        });
      }
    };

    const stopRecording = () => {
      console.log("Stopped the Recording");
      setIsRecording(false);
    };

    const saveShortcut = (keys) => {
      if (keys.size > 0) {
        // Create a combined shortcut string
        const shortcutString = Array.from(keys).map((key) => key.charAt(0).toUpperCase() + key.slice(1)).join(' + ');
        setShortcuts((prevShortcuts) => shortcutString);
        console.log(keys.size + "");
        console.log('Shortcut saved:', shortcutString);
        socket.emit('hotkey-asign', shortcutString);
        console.log('Shortcut saved 2 :', shortcuts);
      }
    };
    document.addEventListener('keydown', detectKeyDown, true);
    document.addEventListener('keyup', detectKeyUp, true);

    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
      document.removeEventListener('keyup', detectKeyUp, true);
    };
  }, [isRecording]);



  useEffect(() => {
    const socket = io('http://localhost:5000')
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    // Handle incoming messages
    socket.on('response', (data) => {
      setResponse(data.data);
    });
    socket.on('server_message', (data) => {
      setResponse(data.data);
      console.log(data.data);
    });
    socket.on('refresh-clips', (data) => {
      setResponse(data.data);
      console.log(data.data);
    });
    const fetchUserProfile = async () => {
      console.log('Fetching user profile...');
      try {
        const response = await fetch('http://localhost:5000/callbackRender');
        // console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const contentType = response.headers.get('Content-Type');
        // console.log('Response content type:', contentType);
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON but received: ' + contentType);
        }
        
        const data = await response.json();
        // console.log('Response data:', data);
        setProfile(data);
        setAuthStatus('Authenticated');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setAuthStatus('Error fetching profile');
      }
    };
    const sendMessage = () => {
      socket.emit('refresh-clips', 'Hello from React!');
    };
    sendMessage();
    fetchUserProfile();
      // Handle connection
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setPressedKeys(new Set()); // Reset the pressed keys
  };
  return (
    <div className='navbar'>
      <ul className='navbar-ul'>
          <div className='profile-container'>
            {authStatus == 'Authenticated' ? 
            (
            <>
              <img id='profile-pic-url' src={profile.profile_pic_url}></img>
              <h1 id='display-name-1'>{profile.display_name}</h1>
              <button onClick={startRecording}>Hotkey Listen</button>
              <ul>
                {shortcuts}
              </ul>
            </>
            ) 
            : 
            (<li><a href="http://localhost:5000/authorizeFlask" rel="noopener noreferrer">Authorize your Account</a></li>)}
          </div>
      </ul>
    </div>
  );
}

export default NavBar;
