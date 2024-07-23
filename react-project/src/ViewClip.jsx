import { useEffect, useState } from 'react'

import './ViewClip.css'

function ViewClip(){

    return(
    <div className="viewclip-container">
        <header>View Clip</header>
        <iframe src="https://clips.twitch.tv/embed?clip=SillyEncouragingFalconKappaWealth-9tdJptqtiutwKRWo&parent=localhost" 
        frameBorder="0" allowFullScreen={true} scrolling="no" height="378" width="620"></iframe>

        
    </div>
    )
}
export default ViewClip