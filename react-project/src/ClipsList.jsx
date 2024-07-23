import './ClipsList.css'

function ClipsList(props){
    const clips = props.clips;

    const displayClips = clips.map(clip => <button key={clip[0]}>
                                            {clip[0]}
                                            </button>

    );
    return(
    <ul className="clipsList">{displayClips}</ul>
    )
}
export default ClipsList