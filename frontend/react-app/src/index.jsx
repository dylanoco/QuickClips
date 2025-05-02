import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Landing from './Landing.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename='/app'>
      <Routes>
        <Route path="/" element={<App />} />  
        {/* <Route path="/" element={<Landing/>} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
