import React, {useEffect, useState} from 'react'

type Theme = 'light' | 'dark'
type ThemeContext = {
    theme: Theme
    toggleTheme: () => void
}

export const ThemeContext = React.createContext<ThemeContext>({} as ThemeContext)

export const ThemeProvider: React.FC = ({children}) => {
    const localStorageTheme = localStorage.getItem('theme') as Theme
    const [theme, setTheme] = useState<Theme>(localStorageTheme ? localStorageTheme : 'light')

    useEffect(() => {
        if (theme === 'light') {
            document.body.className = 'theme-light'
        } else {
            document.body.className = 'theme-dark'
        }
    }, [theme])

    const toggleTheme = () => {
        let currentTheme

        if (theme === 'light') {
            setTheme('dark')
            currentTheme = 'dark'
        } else {
            setTheme('light')
            currentTheme = 'light'
        }

        localStorage.setItem('theme', currentTheme)
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}} >
            {children}
        </ThemeContext.Provider>
    )
}