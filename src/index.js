import React from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css';
import App from './App'; // App.js是一個function component，也是root component
import { BrowserRouter as Router } from 'react-router-dom'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql/',
  cache: new InMemoryCache(),
});

// 將#root與React做掛勾
const root = ReactDOM.createRoot(document.getElementById('root'));

// 這裡傳入render的element相當於Vue的App.vue
// 將App渲染出來

root.render(
  <Router>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Router>


  // <React.StrictMode> 
  // </React.StrictMode>
);