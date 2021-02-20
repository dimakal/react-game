import React, {useEffect, useState} from 'react'
import './App.scss'
import NumberDisplay from "../NumberDisplay";
import {generateCells, openMultipleCells} from "../../utils";
import Button from "../Button";
import {Cell, CellState, CellValue, Face} from '../../types/index'
import {MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS} from "../../constants";

const Minesweeper: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells())
    const [face, setFace] = useState<Face>(Face.smile)
    const [time, setTime] = useState<number>(0)
    const [started, setStarted] = useState<boolean>(false)
    const [bombCounter, setBombCounter] = useState<number>(NUMBER_OF_BOMBS)
    const [lost, setLost] = useState<boolean>(false)
    const [won, setWon] = useState<boolean>(false)

    useEffect(() => {
        if (started && time < 999) {
            const timer = setInterval(() => {
                setTime(time + 1)
            }, 1000)

            return () => {
                clearInterval(timer)
            }
        }
    }, [started, time])

    useEffect(() => {
        if (lost) {
            setStarted(false)
            setFace(Face.lost)
        }
    }, [lost])

    useEffect(() => {
        if (won) {
            setStarted(false)
            setFace(Face.won)
        }
    }, [won])

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {

        if (won || lost) {
            return
        }

        let newCells = cells.slice();

        // start the game
        if (!started) {
            let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
            while (isABomb) {
                newCells = generateCells();
                if (newCells[rowParam][colParam].value !== CellValue.bomb) {
                    isABomb = false;
                    break;
                }
            }
            setStarted(true);
        }

        const currentCell = newCells[rowParam][colParam];

        if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
            return;
        }

        if (currentCell.value === CellValue.bomb) {
            setLost(true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
            return;
        } else if (currentCell.value === CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
        }

        // Check to see if you have won
        let safeClosedCellsExists = false;
        for (let row = 0; row < MAX_ROWS; row++) {
            for (let col = 0; col < MAX_COLS; col++) {
                const currentCell = newCells[row][col];

                if (currentCell.value !== CellValue.bomb && currentCell.state === CellState.closed) {
                    safeClosedCellsExists = true;
                    break;
                }
            }
        }

        if (!safeClosedCellsExists) {
            newCells = newCells.map(row =>
                row.map(cell => {
                    if (cell.value === CellValue.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged
                        };
                    }
                    return cell;
                })
            );
            setWon(true);
        }

        setCells(newCells);
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
        } else if (currentCell.state === CellState.closed) {
            currentCells[rowParam][colParam].state = CellState.flagged
            setCells(currentCells)
            setBombCounter(bombCounter - 1)
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.closed;
            setCells(currentCells);
            setBombCounter(bombCounter + 1);
        }
    }

    const handleFaceClick = (): void => {
        setStarted(false)
        setTime(0)
        setCells(generateCells())
        setBombCounter(NUMBER_OF_BOMBS)
        setFace(Face.smile)
        setLost(false)
        setWon(false)
    }

    const toggleMouseClick = () => (e: React.MouseEvent): void => { // попробовать одну функцию
        if (won || lost) return

        if (e.type === 'mousedown') {
            setFace(Face.oh)
        } else if (e.type === 'mouseup') {
            setFace(Face.smile)
        }
    }

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => row.map((cell, colIndex) => (
            <Button
                key={`${rowIndex} - ${colIndex}`}
                row={rowIndex}
                col={colIndex}
                red={cell.red}
                state={cell.state}
                value={cell.value}
                onClick={handleCellClick}
                onContext={handleCellContext}
                toggleMouseClick={toggleMouseClick}
            />
        )))
    }

    const showAllBombs = (): Cell[][] => {
        const currentCells = cells.slice()
        return currentCells.map(row =>
            row.map(cell => {
                if (cell.value === CellValue.bomb) {
                    return {
                        ...cell,
                        state: CellState.visible
                    }
                }
                return cell
            })
        )
    }

    return (
        <div className={"Minesweeper"}>
            <div className={"header"}>
                <NumberDisplay value={bombCounter}/>
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