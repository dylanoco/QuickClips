import React from "react";
import '../../styles/LeftPanel.css'; // Assuming you have styles for the LeftPanel
import { useState } from "react";
import 'media-chrome';

export default function ClipPreview({ videoURL }) {
    return(
        <div className="flex flex-col w-full h-full p-4">
        <media-controller id="mainController">
            <video
                slot="media"
                src={videoURL}
                width="320" 
                height="180" 
            />
        </media-controller>
            <media-control-bar mediacontroller="mainController" className="w-full">
              <media-play-button></media-play-button>
              <media-time-range></media-time-range>
              <media-seek-back-button></media-seek-back-button>
              <media-seek-forward-button></media-seek-forward-button>
              <media-current-time-display></media-current-time-display>
              <media-duration-display></media-duration-display>
              <media-volume-slider></media-volume-slider>
              <media-mute-button></media-mute-button> 
            </media-control-bar>
        
        </div>
    )
}