import { useState,useEffect } from 'react'
import './ClipsCreated.css'
import ClipsList from './ClipsList'

function ClipsCreated(){
    //here is where u use json to get data from database using flask api
    const [clips, setClips] = useState([]);
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