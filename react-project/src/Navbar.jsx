import { useState, useEffect } from 'react';
import './Navbar.css';
import socket from './socket'; // Import your Socket.IO client instance

function NavBar() {
  const [profile, setProfile] = useState(null);
  const [authStatus, setAuthStatus] = useState('Checking authentication...');

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('Fetching user profile...');
      try {
        const response = await fetch('http://localhost:5000/callbackRender');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const contentType = response.headers.get('Content-Type');
        console.log('Response content type:', contentType);
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Expected JSON but received: ' + contentType);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        setProfile(data);
        setAuthStatus('Authenticated');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setAuthStatus('Error fetching profile');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('response', (data) => {
      console.log('Received response from server:', data);
    });

    return () => {
      socket.off('response');
    };
  }, []);

  return (
    <div className='navbar'>
      <ul className='navbar-ul'>
        <li>
          <div className='profile-container'>
            {authStatus == 'Authenticated' ? 
            (
            <>
              <img id='profile-pic-url' src={profile.profile_pic_url}></img>
              <h1 id='display-name-1'>{profile.display_name}</h1> 
            </>
            ) 
            : 
            (<li><a href="http://localhost:5000/authorizeFlask" rel="noopener noreferrer">Authorize your Account</a></li>)}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
