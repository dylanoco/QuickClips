import { useContext, useEffect } from 'react';
import './ClipsList.css'
import { DataContext } from './DataContext';

//ClipsList which formats the clips and displays them.
function ClipsList(props){ //Props will be the clips from ClipsCreated.jsx
    const clips = props.clips;
    const {setSlug} = useContext(DataContext)
    //displayClips puts each clip into a list, mapping their details and formatting them
    const displayClips = clips.map(clip => 
    <li key = {clip[0]}><div className = "cl-div-button" tabIndex="1"  onClick={() => setSlug(clip[0])}>
        <div className='dategame-wrap' >
            <p id="date">{clip[1]}</p>
            <p id="game">{clip[3]}</p>
        </div>
        <div className='time-wrap'>
            <p id="time">{clip[2]}</p>
        </div>
        </div>
    </li>
    );
    useEffect(() =>
    {
        displayClips
    })
    return(
    <div className='clips-container'>
        <ul className="clipsList scrollbar-style">
            <>
                {displayClips}
            </>
        </ul>
    </div>
    ) 
}
export default ClipsList