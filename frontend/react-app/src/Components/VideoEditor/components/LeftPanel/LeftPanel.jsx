import React from "react";
import '../../styles/LeftPanel.css'; // Assuming you have styles for the LeftPanel
import SplitRatioController from './SplitRatioController.jsx';
import { useState } from 'react';

function LeftPanel({facecamSplit, setFacecamSplit}) {
  return (
    <div className="left-panel w-1/4 h-screen bg-gray-800 text-white p-4  ">
      <h2 className="text-lg font-bold mb-4 text-center">Video Editor Controls</h2>
      <ul className="space-y-2 overflow-y-auto scrollbar-hide flex-1">
        <li>
          <SplitRatioController facecamSplit={facecamSplit}
          setFacecamSplit={setFacecamSplit} />
        </li>
      </ul>
    </div>
  );
}
export default LeftPanel;
