import React, {useState} from 'react'
import  './App.scss'
import NumberDisplay from "../NumberDisplay";
import {generateCells} from "../../utils";
import Button from "../Button";

const Minesweeper: React.FC = () => {
    const [cells, setCells] = useState(generateCells())

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => (
            <Button
                key={`${rowIndex} - ${colIndex}`}
                row={rowIndex}
                col={colIndex}
                state={cell.state}
                value={cell.value}
            />
        )))
    }

    return (
        <div className={"Minesweeper"}>
            <div className={"header"}>
                <NumberDisplay value={0} />
                <div className={'face'}>
                    <span> 😀 </span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className={"body"}> {renderCells()} </div>
        </div>
    )
}

export default  Minesweeper