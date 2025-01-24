import React, { createContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client';

import {Toaster, toast} from 'sonner'

//DataContext / DataProvider used to help the two components communicate with clips.
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
    const [slug, setSlug] = useState("")
    const [clips, setClips] = useState([]);

    const [response, setResponse] = useState('');
    useEffect(() => {
      const socket = io('http://localhost:5000') //Connects to Backend via SocketIO. Communicates through 'refresh-clips' channel
      socket.on('refresh-clips', (data) => {
          setResponse(data.data);
          console.log(data.data);
          toast.success(data.data);
          });
          fetch('http://localhost:5000/clips', ['GET'])
          .then(response => response.json())
          .then(clips => {
              setClips(clips);
              console.log(clips)
              
          })
          .catch(error => console.error('Error fetching data:', error));
      }, [response]);

    return( //Provides the two useStates to both children 
        <DataContext.Provider value={{clips, setClips, slug, setSlug }}> 
            {children}
        </DataContext.Provider>
    )
}