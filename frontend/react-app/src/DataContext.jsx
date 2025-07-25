import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Popup from "./Popup";
import AppVersion from '../version.json'

import {Toaster, toast} from 'sonner';

//DataContext / DataProvider used to help the two components communicate with clips.
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const [slug, setSlug] = useState("")
    const [clips, setClips] = useState([]);


    const [isOutdated, setIsOutdated] = useState(false);
    const [showPopup, setShowPopup] = useState(false);


    const [response, setResponse] = useState('');
    useEffect(() => {
      const socket = io('http://localhost:5000') //Connects to Backend via SocketIO. Communicates through 'refresh-clips' channel
      socket.on('refresh-clips', (data) => {        
          console.log(data.data);
          toast.success(data.data);
          fetch('http://localhost:5000/clips', ['GET'])
          .then(response => response.json())
          .then(clips => {
              setClips(clips);
              console.log(clips)
              
          })
          .catch(error => console.error('Error fetching data:', error));
          setResponse(data.data);
        
          });
      }, [response]);

      useEffect(() => {
        fetch('http://localhost:5000/api/version', ['GET'])
          .then((response) => response.json())
          .then((data) => {
            const versionData = AppVersion.required_backend_version
            console.log("Backend Version: " + data.backend_version);
            console.log("Required Backend Version: " + versionData);
            if (data.backend_version!== versionData) {
              setIsOutdated(true);
              setShowPopup(true);
            }
          })
          .catch((error) => {
            console.error("Error fetching backend version:", error);
          });
      }, []);

      const handleClosePopup = () => {
        setShowPopup(false);
      };

    return( //Provides the two useStates to both children 
        <DataContext.Provider value={{clips, setClips, slug, setSlug }}> 
            <Toaster/>
            <div>
              {isOutdated && showPopup && (
                <Popup
                  message="Your application is outdated. Please update to the latest version."
                  onClose={handleClosePopup}
                />
              )}
          </div>
            {children}
        </DataContext.Provider>
    )
}