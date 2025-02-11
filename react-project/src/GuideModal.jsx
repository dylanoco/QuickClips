import React from 'react';

const GuideModal = ({ isOpen, toggleModal }) => {
    if (!isOpen) return null;

    return (
        <div className="modal">
        <div onClick={toggleModal} className="overlay"></div>
        <div className="modal-content">
          <div className='modal-guide'>
            <div className='hkl-container'>
              <h3>Hotkey Listen</h3>
              <p>Manually change the hotkey to create your clips. Press on the ‘Hotkey Listen’ Button, press the key(s) you want to create a clip with, and the app will confirm the selected key(s).</p>
            </div>
            <div className='cc-container'>
              <h3>Clips Created</h3>
              <p>Where clips that are created during your stream reside. WHILE LIVE: Press the hotkey to create a clip. The clip will then be created and be available for you to preview, edit, or remove it.</p>
            </div>
            <div className='vc-container'>
              <h3>View Clips</h3>
              <p>Clicking on a clip from ‘Clips Created’ section allows you to preview, edit, or remove clips in this section. Edit: Opens up Twitch’s Editing Page where you can trim/expand the clip, edit the title, and more. Remove from List: Removes the clip from your application (will still exist as a clip on your Twitch Channel!).</p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default GuideModal;