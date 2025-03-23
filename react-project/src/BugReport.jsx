import React from 'react';
import { useState } from 'react';
import styles from './BugReport.module.css';

const BugReport = ({ isOpen, toggleModal }) => {
  if (!isOpen) return null;

const [email, setEmail] = useState("");
const [description, setDescription] = useState("");

const handleEmailChange = (e) => setEmail(e.target.value);
const handleDescriptionChange = (e) => setDescription(e.target.value);
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = {
    email,
    description,
  };

  try {
    const response = await fetch("http://localhost:5000/BugReport", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await response.json();
    console.log("Success:", responseData);
    setEmail("");
    setDescription(""); 
  } catch (error) {
    console.error("Error:", error);
  } 
}

  return (
    <div className="modal">
      <div onClick={toggleModal} className={styles.overlay}></div>
        <div className={styles['modalGuide']}>
          <form onSubmit={handleSubmit}>
            <header>Report a Bug</header>
            <div className={styles['brInputs']}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email address." id="textbox" value={email} onChange={handleEmailChange} required/>
            </div>

            <div className={styles['brInputs']}>
              <label>Description</label>
              <textarea id="textbox" placeholder="Please describe the bug." value={description}  onChange={handleDescriptionChange} required />
            </div>

            <input type="submit"></input>
          </form>
      </div>
    </div>
  );
};

export default BugReport;