import React from 'react';
import styles from './BugReport.module.css';
const BugReport = ({ isOpen, toggleModal }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
        <div onClick={toggleModal} className={styles.overlay}></div>
        <div className={styles['modalContent']}>
          <div className={styles['modalGuide']}>
            <form>
              <label>Email</label>
              <input></input>
              <label>Description</label>
              <textarea></textarea>
            </form>
          </div>
        </div>
      </div>
    );
};

export default BugReport;