import { useContext,useState,useEffect } from 'react'
import { io } from 'socket.io-client';
import './ClipsCreated.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';
//Displays the clips that have been created. Uses ClipsList for formatting each clip
function ClipsCreated(){
    const {clips} = useContext(DataContext)
    const {setClips} = useContext(DataContext)

    const {reload, setReload} = useState(false)
    //Grabbing Clips from Database
    useEffect(() => {
        fetch('http://localhost:5000/clips', ['GET'])
            .then(response => response.json())
            .then(clips => {
                setClips(clips);
                console.log(clips)
            })
            .catch(error => console.error('Error fetching data:', error));
        }, [reload]);
    return(
        <div className="clipscreated-container">
            <div>
            <header>Clips Created</header>
            <button className="force-reload-button" onClick={() => setReload(refresh => !refresh) }>Reload</button>
            </div>
            
            <ClipsList clips={clips}/>
        </div>
        )
}
export default ClipsCreated