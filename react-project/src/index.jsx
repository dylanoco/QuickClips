import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// const express = require("express");
// const cors = require("cors")
// const app = express();

// app.use(
//   cors({
//     origin:"http://localhost:5000",
//     methods:["GET"],
//   })
// );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)