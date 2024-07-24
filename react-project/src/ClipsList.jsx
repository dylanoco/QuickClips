import { useContext } from 'react';
import './ClipsList.css'
import { DataContext } from './DataContext';
function ClipsList(props){
    const clips = props.clips;

    const {setSlug} = useContext(DataContext)

    const displayClips = clips.map(clip => <button onClick = {() => setSlug(clip[0])}key={clip[0]}>
                                            {clip[0]}
                                            </button>

    );
    return(
    <ul className="clipsList">{displayClips}</ul>
    )
}
export default ClipsList