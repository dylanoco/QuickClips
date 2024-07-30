import { useContext, useEffect } from 'react';
import './ClipsList.css'
import { DataContext } from './DataContext';
function ClipsList(props){
    const clips = props.clips;


    const {setSlug} = useContext(DataContext)
    const displayClips = clips.map(clip => 
    <li key = {clip[0]}><div className = "cl-div-button" tabIndex="1"  onClick={() => setSlug(clip[0])}>
        <div className='dategame-wrap' >
            <p id="date">{clip[1]}</p>
            <p id="game">{clip[3]}</p>
        </div>
        <div className='time-wrap'>
            <p id="time">{clip[2]}</p>
        </div>
    </div></li>
    );

    useEffect(() =>
    {
        displayClips
    })
    return(
    <ul className="clipsList">
        <>
            {displayClips}
        </>
    </ul>
    ) 
}
export default ClipsList

//CLICKABLE DIV WITH ONCLICK, THEN FORMAT TEXT INSIDE THAT DIV.