import { useEffect, useState, useContext } from 'react'
import './ViewClip.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';

function ViewClip(){

    const { slug } = useContext(DataContext);
    const urlBody = "https://clips.twitch.tv/embed?clip=";
    const urlParent = "&parent=localhost";
    const url = urlBody.concat(slug, urlParent);

    useEffect(() => {
      }, []);


    return(
    <div className="viewclip-container">
        <header>View Clip</header>
        <iframe src={url}
        frameBorder="0" allowFullScreen={true} scrolling="no" height="378" width="620"></iframe>
    </div>
    )
}
export default ViewClip