import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import Minesweeper from "./components/App";
import {ThemeProvider} from "./Theme/ThemeProvider";

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider>
            <Minesweeper/>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
