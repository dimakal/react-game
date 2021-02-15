import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Minesweeper from "./components/App";

ReactDOM.render(
  <React.StrictMode>
    <Minesweeper />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
