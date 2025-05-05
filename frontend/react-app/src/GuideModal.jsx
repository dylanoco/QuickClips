import React from 'react';
import styles from './GuideModal.module.css';

const GuideModal = ({ isOpen, toggleModal }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modal}>
            <div className={styles.overlay} onClick={toggleModal}></div>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={toggleModal}>✖</button>
                <h2 className={styles.modalTitle}>QuickClips Guide</h2>
                <div className={styles.modalGuide}>
                    <div className={styles.guideSection}>
                        <h3>🎯 Hotkey Listen</h3>
                        <p>Manually change the hotkey to create your clips. Press the ‘Hotkey Listen’ button, press the key(s) you want, and the app will confirm the selected key(s).</p>
                    </div>
                    <div className={styles.guideSection}>
                        <h3>📁 Clips Created</h3>
                        <p>Where your live-stream clips are stored. While live, press the hotkey to save a clip. You can preview, edit, or remove it anytime.</p>
                    </div>
                    <div className={styles.guideSection}>
                        <h3>🔍 View Clips</h3>
                        <p>Click a clip to preview, edit on Twitch’s editing page (trim, expand, retitle), or remove it from your app list (it will still remain on your Twitch channel).</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideModal;
