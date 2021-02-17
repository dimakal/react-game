import React, {useEffect, useState} from 'react'
import './App.scss'
import NumberDisplay from "../NumberDisplay";
import {generateCells} from "../../utils";
import Button from "../Button";
import {Cell, CellState, Face} from '../../types/index'

const Minesweeper: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells())
    const [face, setFace] = useState<Face>(Face.smile)
    const [time, setTime] = useState<number>(0)
    const [started, setStarted] = useState<boolean>(false)

    useEffect(() => {
        const handleMouseDown = (): void => {
            setFace(Face.oh)
        }

        const handleMouseUp = (): void => {
            setFace(Face.smile)
        }

        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)

        return () => {
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('mousedown', handleMouseDown)
        }
    }, [])

    useEffect(() => {
        if (started) {
            const timer = setInterval(() => {
                setTime(time + 1)
            }, 1000)

            return () => {
                clearInterval(timer)
            }
        }
    }, [started, time])

    const handleCellClick = (colParam: number, rowParam: number) => (): void => {
        // start the game
        if (!started) {
            setStarted(true)
        }
    }

    const handleCellContext = (rowParam: number, colParam: number) => (e: React.MouseEvent): void => {
        e.preventDefault()

        if (!started) {
            return
        }

        const currentCells = cells.slice()
        const currentCell = currentCells[rowParam][colParam]

        if (currentCell.state === CellState.visible) {
            return;
        } else if (currentCell.state === CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged
            setCells(currentCells)
        }
    }

    const handleFaceClick = (): void => {
        if (started) {
            setStarted(false)
            setTime(0)
            setCells(generateCells())
        }
    }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => (
            <Button
                key={`${rowIndex} - ${colIndex}`}
                row={rowIndex}
                col={colIndex}
                state={cell.state}
                value={cell.value}
                onClick={handleCellClick}
                onContext={handleCellContext}
            />
        )))
    }

    return (
        <div className={"Minesweeper"}>
            <div className={"header"}>
                <NumberDisplay value={0}/>
                <div className={'face'} onClick={handleFaceClick}>
                    <span> {face} </span>
                </div>
                <NumberDisplay value={time}/>
            </div>
            <div className={"body"}> {renderCells()} </div>
        </div>
    )
}

export default Minesweeper