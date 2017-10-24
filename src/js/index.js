import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';  // eslint-disable-line

const element = document.getElementById('content');
ReactDOM.render(<App />, element);

document.body.classList.remove('loading');
