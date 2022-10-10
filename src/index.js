import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App'; // App.js是一個function component，也是root component

// 將#root與React做掛勾
const root = ReactDOM.createRoot(document.getElementById('root'));

// 這裡傳入render的element相當於Vue的App.vue
// 將App渲染出來

root.render(
  // <React.StrictMode> 
    <App />
  // </React.StrictMode>
);