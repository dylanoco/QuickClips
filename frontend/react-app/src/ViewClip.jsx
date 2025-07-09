import { useEffect, useState, useContext } from 'react'
import './ViewClip.css'
import ClipsList from './ClipsList'
import { DataContext } from './DataContext';
import { FaBug } from "react-icons/fa";
//Displays the Selected Clip to Preview, Edit or Delete from the Datbase.
function ViewClip(){

    const { slug, setSlug, clips, setClips } = useContext(DataContext); //The Shared useStates provided by DataContext
    //Parts of the URL Segmented for when shifting through Clips
    const urlBody = "https://clips.twitch.tv/embed?clip=";
    const urlParent = "&parent=quickclips.uk&parent=localhost";
    const url = urlBody.concat(slug, urlParent);
    
    function removeList(slug){
      console.log("Starting fetch request"); // POST's the Slug from Client to Database to get deleted
      fetch("http://localhost:5000/removeClip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slug)
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

    function openEdit(slug){ //Gets the link of the slug thats selected from the Database, then opens the link
      console.log("test");
      fetch("http://localhost:5000/getLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slug)
      })
      .then((response) => response.json())
      .then((link) => window.open(link[0], '_blank', 'location=yes'))
      .then((link) => console.log("Success:", link[0]))
      .catch((error) => console.error("Error:", error))
    }




    return(
    <>
    <div className="flex flex-col justify-center w-screen h-screen items-center border-box overflow-hidden viewclip-bg">
    {slug == ''? 
            (
            <div className='flex justify-center items-center'>
              <h1 className= 'font-bold text-xl' >No Clip has been Selected.</h1> 
            </div>
            ) 
            : 
            (
              <div className='flex flex-col w-full h-full justify-center p-12 py-24'>
                <iframe className='border-purple-300 border-2 rounded-2xl shadow-sm shadow-purple-700 h-150  w-full' src={url} muted allowFullScreen ></iframe>
                <div className='flex flex-row text-center items-center justify-center space-x-12 pt-12'>
                  <button className='button-format' onClick = {() => openEdit(slug)}>Edit</button>
                  <button className='button-format' onClick = {() => removeList(slug)}>Remove from List</button>
                </div>
              </div>
            )}
      </div>
    </>
    )
}
export default ViewClip