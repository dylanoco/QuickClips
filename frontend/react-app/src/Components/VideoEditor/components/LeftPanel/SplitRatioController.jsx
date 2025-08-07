import React from "react";
import '../../styles/LeftPanel.css';
import { useState } from 'react';   

export default function SplitRatioController({ facecamSplit, setFacecamSplit }) {
  const handleChange = (e) => {
    setFacecamSplit(e.target.value);
  };

  return (
    <div className="split-ratio-controller">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        Facecam Split Ratio: {facecamSplit}%
      </label>
      <input
        type="range"
        min="20"
        max="80"
        value={facecamSplit}
        onChange={handleChange}
        style={{
            background: `linear-gradient(to right, #ff4444 0%, #ff4444 ${facecamSplit}%, #4444ff ${facecamSplit}%, #4444ff 100%)`,
          }}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}