import { useEffect, useState, useContext } from 'react'
import './ViewClip.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';

function ViewClip(){

    const { slug, setSlug, clips, setClips } = useContext(DataContext);
    console.log(slug + "test slug");
    const urlBody = "https://clips.twitch.tv/embed?clip=";
    const urlParent = "&parent=localhost";
    const url = urlBody.concat(slug, urlParent);
    
    function removeList(slug){
      console.log("Starting fetch request");
      fetch("http://localhost:5000/removeClip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slug )
      })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        console.log("Before Slug Removed: " + slug)
        setSlug('');
        console.log("After Slug Removed: " + slug)
        fetch('http://localhost:5000/clips', ['GET'])
        .then(response => response.json())
        .then(clips => {
            setClips(clips);
        },
        console.log(clips + "ViewClips Render"))
        .catch(error => console.error('Error fetching data:', error));
      })
      .catch(error => {
        console.error("Error:", error);
      });
    };

    function openEdit(slug){
      console.log("test");
      fetch("http://localhost:5173/getLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slug)
      })
      .then((response) => response.json())
      .then((link) =>window.open(link[0], '_blank', 'location=yes'))
      .then((link) => console.log("Success:", link[0]))
      .catch((error) => console.error("Error:", error))
    }




    return(
    <>
    <div className="viewclip-container">
    {slug == ''? 
            (
            <>
              <h1 >No Clip has been Selected.</h1> 
            </>
            ) 
            : 
            (
              <div className='vc-controls-container'>
                <iframe src={url}
                frameBorder="0" allowFullScreen={true} scrolling="no" ></iframe>
                <button onClick = {() => openEdit(slug)}id='vc-b-1'>Edit</button>
                <button onClick = {() => removeList(slug)} id='vc-b-2'>Remove from List</button>
              </div>
            )}
      </div>
    </>
    )
}
export default ViewClip