import { useContext,useState,useEffect } from 'react'
import './ClipsCreated.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';

function ClipsCreated(){
    const {clips} = useContext(DataContext)
    const {setClips} = useContext(DataContext)
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