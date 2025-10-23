// main.js / index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles.css';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';



ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="237357284961-dgekrp016uek3gc0qlch2683ivr68qgq.apps.googleusercontent.com">
   

    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
