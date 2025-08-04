import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VideoEditor from './VideoEditor.jsx';

import ReactGA from "react-ga4";

ReactGA.initialize("G-S1CP97ZRKV");
// import Landing from './Landing.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editor" element={<VideoEditor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
