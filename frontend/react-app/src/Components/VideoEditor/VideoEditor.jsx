import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/VideoEditor.css';
import VE_NavBar from './components/NavBar/VE_NavBar.jsx';
import LeftPanel from './components/LeftPanel/LeftPanel.jsx';
import { useState } from 'react';
import ClipPreview from './components/ClipPreview/ClipPreview.jsx';
function VideoEditor() {
  const location = useLocation();
  const { link } = location.state || {};
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  }



  const [facecamSplit, setFacecamSplit] = useState(50);
  const [videoURL, setVideoURL] = useState(link || '');
 return (
  <>
    <VE_NavBar onGoBack={handleGoBack} />
    <div className='flex flex-row'>
      <LeftPanel facecamSplit={facecamSplit} setFacecamSplit={setFacecamSplit}/>
      <ClipPreview videoURL={videoURL}/>
    </div>
  </>
  )
}

export default VideoEditor
