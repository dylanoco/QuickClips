import { useState, useEffect } from 'react';
import './Navbar.css';
import { io } from 'socket.io-client';


function NavBar() {
  const [profile, setProfile] = useState('');
  const [authStatus, setAuthStatus] = useState('Checking authentication...');
  // const [response, setResponse] = useState('');

  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false); 
  const [shortcuts, setShortcuts] = useState(); 



  useEffect(() => {
    const socket = io('http://localhost:5000')
    const detectKeyDown = (event) => {
      if (isRecording) {
        const key = event.key.toLowerCase(); 
        setPressedKeys((prevKeys) => new Set(prevKeys).add(key));
      }
    };

    const detectKeyUp = (event) => {
      if (isRecording) {
        const key = event.key.toLowerCase(); 
        setPressedKeys((prevKeys) => {
          const newKeys = new Set(prevKeys); 
          console.log(isRecording)
          saveShortcut(prevKeys); 
          console.log("Test Stop Recording")
          stopRecording(); 
          document.removeEventListener('keyup', detectKeyUp, true);
          newKeys.clear; 
          return newKeys;
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
        socket.emit('hotkey-assign', shortcutString);
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
    const fetchUserProfile = async () => {
      console.log('Fetching user profile...');
      try {
        const response = await fetch('http://localhost:5000/callbackRender');
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON but received: ' + contentType);
        }
        const data = await response.json();
        setProfile(data);
        if(profile != ""){
          setAuthStatus('Authenticated');
          console.log(profile.hotkey);
          console.log(profile);
        }
        else{
          setAuthStatus('Unauthenticated');
          console.log("User is unauthenticated");
        }
        
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setAuthStatus('Error fetching profile');
      }
    };
    fetchUserProfile();
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setPressedKeys(new Set());
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
              <p>{profile.hotkey}</p>
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
