import React, { useState } from "react";
import { IoClose } from "react-icons/io5"; // Import close icon
import "./Popup.css"; // Import CSS for styling

const Popup = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Notify parent component that the popup is closed
  };

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className="popup-container">
      <div className="popup-content">
        <span>{message}</span>
        <button className="popup-close-button" onClick={handleClose}>
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default Popup;