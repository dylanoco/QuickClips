import { useEffect, useState, useContext } from 'react'
import './ViewClip.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';

function ViewClip(){

    const { slug } = useContext(DataContext);
    const urlBody = "https://clips.twitch.tv/embed?clip=";
    const urlParent = "&parent=localhost";
    const url = urlBody.concat(slug, urlParent);

    function removeList(slug){
      console.log("test");
      fetch("http://localhost:5000/removeClip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slug)
      })
      .then((response) => response.json())
      .then((data) => console.log("Success:", data))
      .catch((error) => console.error("Error:", error))

    }




    return(
    <div className="viewclip-container">
        <header>View Clip</header>
        <iframe src={url}
        frameBorder="0" allowFullScreen={true} scrolling="no" height="378" width="620"></iframe>
        <div className='buttons-container'>
          <div className='vc-buttons'>
            <button id='vc-b-2'>Edit</button>
            <button onClick = {() => removeList(slug)} id='vc-b-3'>Remove from List</button>
          </div>
        </div>
    </div>
    )
}
export default ViewClip