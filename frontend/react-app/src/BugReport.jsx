import React from 'react';
import { useState } from 'react';
import styles from './BugReport.module.css';
import { getBugReportEmailHTML } from './BugReportEmail';

const BugReport = ({ isOpen, toggleModal }) => {

const [email, setEmail] = useState("");
const [description, setDescription] = useState("");
if (!isOpen) return null;

const handleEmailChange = (e) => setEmail(e.target.value);
const handleDescriptionChange = (e) => setDescription(e.target.value);
const handleSubmit = async (e) => {
  e.preventDefault();
  const bugDescription = getBugReportEmailHTML(description)
  const rawDescription = description
  const data = {
    email: email || "N/A@gmail.com",
    bugDescription,
    rawDescription
  };

  try {
    console.log(data.email)
    const response = await fetch("http://localhost:5000/BugReport", 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

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
        <div className={`${styles['modalGuide']} text-xl w-xl p-16 bg-blue-500/80 rounded-3xl border-2 border-amber-50/20 drop-shadow-2xl drop-shadow-blue-500/20`}>
          <form className='w-full h-auto' onSubmit={handleSubmit}>
            <h1 className='font-medium text-4xl pb-8 text-shadow-sm'>Report a Bug</h1>
            <div className='mb-8'>
              <label className='block font-bold mb-2 text-xl'>Email <span className='font-medium text-sm'>(Optional)</span></label>
              <input className='text-base rounded-3xl border-1 border-amber-50/50 p-2 bg-amber-50/20 font-medium shadow-xl ease-in-out duration-300 hover:scale-102'type="email" placeholder="Enter your email address." id="textbox" value={email} onChange={handleEmailChange}/>
            </div>
            <div className='mb-8'>
              <label className='block font-bold mb-2 text-xl'>Description</label>
              <textarea className='text-base w-full h-auto rounded-3xl border-1 border-amber-50/50 p-2 bg-amber-50/20 font-medium shadow-xl ease-in-out duration-300 hover:scale-102'  id="textbox" placeholder="Please describe the bug." value={description}  onChange={handleDescriptionChange} required />
            </div>
            <div className=' ease-in-out duration-300 transition-transform hover:scale-105 font-bold  border-2 rounded-3xl p-4 bg-amber-50/20  text-center align-middle justify-center content-center '>
              <input className='text-shadow-lg  ' type="submit"></input>
            </div>
            
          </form>
      </div>
    </div>
  );
};

export default BugReport;