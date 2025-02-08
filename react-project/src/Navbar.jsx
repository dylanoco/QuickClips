import { useState, useEffect } from 'react';
import './Navbar.css';
import { io } from 'socket.io-client';

import { FaBug } from "react-icons/fa";


function NavBar() {
  const [profile, setProfile] = useState('');
  const [authStatus, setAuthStatus] = useState('Checking authentication...');
  // const [response, setResponse] = useState('');

  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [isRecording, setIsRecording] = useState(false); 
  const [shortcuts, setShortcuts] = useState(); 
  const [modal, setModal] = useState(false);
  const [guideModal, setguideModal] = useState(false);
  

  const toggleModal = () => {
    setModal(!modal);
  }
  const toggleguideModal = () => {
    setguideModal(!guideModal);
  }



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
      toggleModal();
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
        console.log(data)
        setProfile(data);
        if(data != ""){
          setAuthStatus('Authenticated');
          console.log(profile.hotkey);
          console.log(profile);
        }
        else{
          setAuthStatus('Unauthenticated');
          console.log("User is unauthenticated");
          console.log(profile);
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
              <button className={isRecording ? 'blue-text' : 'red-text'} onClick={startRecording}>Hotkey Listen</button>
              <p>{profile.hotkey}</p>
              <button onClick={toggleguideModal}>Guide</button>
              <div id='bug-icon'><FaBug/></div>
              {modal && (
                <div className="modal">
                  <div onClick={toggleModal} className="overlay"></div>
                  <div className='modal-content'>
                    <h1>Hotkey Saved !</h1>
                  </div>
                </div>
              )}
              {guideModal && (
                <div className="modal">
                  <div onClick={toggleguideModal} className="overlay"></div>
                  <div className='modal-guide'>
                    <div className='hkl-container'>
                      <h3>Hotkey Listen</h3>
                      <p>Manually change the hotkey to create your clips.
                          Press on the ‘Hotkey Listen’ Button
                          Press the key(s) you want to create a clip with
                          The app will confirm the selected key(s).
                      </p>
                      </div>
                    <div className='cc-container'>
                      <h3>Clips Created</h3>
                      <p>Where clips that are created during your stream reside.
                        WHILE LIVE: Press the hotkey to create a clip
                        The clip will then be created, and then be available for you to click and preview, edit or remove it.</p>
                    </div>
                    <div className='vc-container'>
                      <h3>View Clips</h3>
                      <p>Clicking on a clip from ‘Clips Created’ section allows you to preview, edit or remove clips in this section.
                        Edit: Opens up Twitch’s Editing Page where you can trim/expand the clip, edit the title and more.
                        Remove from List: Removes the clip from your application (will still exist as a clip on your Twitch Channel!)</p>
                      </div>
                  </div>
                </div>
              )}
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
