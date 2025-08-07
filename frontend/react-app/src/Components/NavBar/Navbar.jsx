import { useState, useEffect } from 'react';
import '../styles/NavBar.css';
import GuideModal from '../Modals/GuideModal.jsx';
import BugReport from '../BugReport/BugReport.jsx';
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
  const [bugReportModal, setbugReportModal] = useState(false);


  const toggleModal = () => {
    setModal(!modal);
  }
  const toggleguideModal = () => {
    setguideModal(!guideModal);
  }
  const togglebugReportModal = () => {
    setbugReportModal(!bugReportModal);
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
        if (data != null) {
          setAuthStatus('Authenticated');
          console.log(profile.hotkey);
          console.log(profile);
        }
        else {
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
    <div className='flex bg-[#18181C]'>
            {authStatus == 'Authenticated' ?
            (
            <div className='flex flex-col items-start  w-max space-y-12 px-4'>
              <div className='flex flex-row items-center space-x-4 clear-both w-full rounded-3xl py-2 drop-shadow-lg'>
                  <img className='border-1 border-white rounded-full w-20 ' src={profile.profile_pic_url}></img>
                  <p className='text-2xl text-shadow-md  font-bold'>{profile.display_name}</p>
              </div>
              <div className='flex flex-row space-x-4 items-center'>
                <button className={`${isRecording ? 'text-blue-500' : 'text-white-500'} space-x-4 button-format border-purple-600`}
                onClick={startRecording}>Hotkey Listen</button>
                <p className='font-bold'>{profile.hotkey}</p>
              </div>
                <button className='button-format'onClick={toggleguideModal}>Guide</button>
                {modal && (
                  <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className='modal-content'>
                      <h1>Hotkey Saved !</h1>
                    </div>
                  </div>
                )}
                {guideModal && (
                  <GuideModal isOpen={guideModal} toggleModal={toggleguideModal} />
                )}
                {bugReportModal && (
                  <BugReport isOpen={bugReportModal} toggleModal={togglebugReportModal} />
                )}
                <div className='flex flex-row items-end space-x-4 last-of-type:mt-auto '>
                  <button className='self-center animate-bounce duration-1200 bg-gradient-to-l from-blue-500 to-purple-600 rounded-4xl p-4 shadow-md shadow-blue-400/20 transition:transform hover:scale-105' data-tally-open="wbMDBL" data-tally-emoji-text="🎬" data-tally-emoji-animation="wave" data-tally-auto-close="5000">Feedback 🎉</button>
                  <div onClick={togglebugReportModal} className='self-center text-2xl transition-transform hover:scale-115 ease-in-out'><FaBug /></div>
                </div>
            </div>
            )
            :
            (<li><a href="http://localhost:5000/authorizeFlask" rel="noopener noreferrer">Authorize your Account</a></li>)}
    </div>
  );
}

export default NavBar;
