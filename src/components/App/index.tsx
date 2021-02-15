import React from 'react'
import  './App.scss'
import NumberDisplay from "../NumberDisplay";

const Minesweeper: React.FC = () => {
    return (
        <div className={"Minesweeper"}>
            <div className={"header"}>
                <NumberDisplay value={0} />
                <div className={'face'}>
                    <span> 😀 </span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className={"body"}> Body </div>
        </div>
    )
}

export default  Minesweeper