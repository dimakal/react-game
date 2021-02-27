import React, {useContext} from "react";
import {ThemeContext} from "../../Theme/ThemeProvider";
import './ThemeSwitcher.scss'

const ThemeSwitcher: React.FC = () => {

    const {theme, toggleTheme} = useContext(ThemeContext)

    return (
        <label className={'themeSwitcher'}>
            {theme.charAt(0).toUpperCase() + theme.slice(1)} theme
            <div className="wrapper">
                <div className={`btn ${theme === 'light' ? 'on' : 'off'}`} />
            </div>
            <button hidden onClick={toggleTheme}> {theme} </button>
        </label>
    )
}

export default ThemeSwitcher