import React from "react";
import "./index.css";

const LandingPage = () => {
  return (
    <div>
      <header>
        <h1>QuickClips</h1>
        <p>Instantly capture your favorite Streaming moments with one hotkey. Fast. Simple. Powerful.</p>
        <a href="https://yourdomain.com/download/QuickClips.exe" className="download-btn">
          Download .EXE
        </a>
      </header>

      <section className="features">
        <div className="feature">
          <h3>🎯 One-Key Clipping</h3>
          <p>Just tap a key and QuickClips saves the moment — no distractions or overlays.</p>
        </div>
        <div className="feature">
          <h3>📁 Built-In Viewer</h3>
          <p>Access all saved clips directly inside the app, with links to edit or rename on Twitch.</p>
        </div>
        <div className="feature">
          <h3>⚡ Lightweight</h3>
          <p>Zero bloat. Launches fast, runs smooth — doesn’t eat up your CPU while you stream.</p>
        </div>
        <div className="feature">
          <h3>🧠 Dead Simple Setup</h3>
          <p>No accounts, no fluff. Bind your key and start clipping in seconds.</p>
        </div>
      </section>

      <section className="cta">
        <h2>Start capturing clips like a pro.</h2>
        <a href="https://yourdomain.com/download/QuickClips.exe" className="download-btn">
          Download Now
        </a>
      </section>

      <footer>
        &copy; 2025 QuickClips. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
