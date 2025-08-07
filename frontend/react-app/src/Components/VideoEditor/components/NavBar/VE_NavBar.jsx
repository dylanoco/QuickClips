import React from "react";
import '../../styles/VE_NavBar.css';
import '../../../styles/ButtonFormat.css';

function VE_NavBar({ onGoBack }) {
  return (
    <div className='flex flex-row items-center justify-between w-screen h-20 bg-[#1e293b] text-white border-b-2 border-amber-50/50'>
        <div className="flex flex-row text-center items-center justify-between">
            <button onClick={onGoBack} className='rounded-3xl py-4 w-50 mx-4 bg-[#475569] 
            transition-transform hover:scale-105'>Back to Clips</button>
            <h2 className="font-bold">Edit Layout</h2>
        </div>
        <div>
            <button className='button-format w-50 mx-4'>Process & Export</button>
        </div>
    </div>
  );
}
export default VE_NavBar;