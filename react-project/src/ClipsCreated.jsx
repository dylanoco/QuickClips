import { useContext,useState,useEffect } from 'react'
import { io } from 'socket.io-client';
import './ClipsCreated.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';
//Displays the clips that have been created. Uses ClipsList for formatting each clip
function ClipsCreated(){
    const {clips} = useContext(DataContext)
    const {setClips} = useContext(DataContext)
    //Grabbing Clips from Database
    useEffect(() => {
        fetch('http://localhost:5000/clips', ['GET'])
            .then(response => response.json())
            .then(clips => {
                setClips(clips);
                console.log(clips)
            })
            .catch(error => console.error('Error fetching data:', error));
        }, []);
    return(
        <div className="clipscreated-container">
            <header>Clips Created</header>
            <ClipsList clips={clips}/>
        </div>
        )
}
export default ClipsCreated