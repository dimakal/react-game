import React, {useEffect, useMemo, useState} from 'react'
import './App.scss'
import NumberDisplay from "../NumberDisplay";
import {generateCells, openMultipleCells} from "../../utils";
import Button from "../Button";
import {Cell, CellState, CellValue, Difficult, Face} from '../../types'
import {
    MAX_COLS_EASY,
    MAX_COLS_HARD,
    MAX_COLS_NORMAL,
    MAX_ROWS_EASY,
    MAX_ROWS_HARD,
    MAX_ROWS_NORMAL,
    NUMBER_OF_BOMBS_EASY,
    NUMBER_OF_BOMBS_HARD,
    NUMBER_OF_BOMBS_NORMAL
} from "../../constants";
import DifficultChanger from "../DifficultChanger";
import ThemeSwitcher from "../ThemeSwitcher";
import SoundButtons from "../SoundButtons";

const Minesweeper: React.FC = () => {

    const [initialized, setInitialized] = useState<boolean>(false)
    const [maxRows, setMaxRows] = useState<number>(MAX_ROWS_EASY)
    const [maxCols, setMaxCols] = useState<number>(MAX_COLS_EASY)
    const [bombCounter, setBombCounter] = useState<number>(NUMBER_OF_BOMBS_EASY)

    const initialCells = useMemo(() => generateCells(maxRows, maxCols, NUMBER_OF_BOMBS_EASY), [] )

    const [cells, setCells] = useState<Cell[][]>(initialCells)
    // const [cells, setCells] = useState<Cell[][]>(generateCells(maxRows, maxCols, NUMBER_OF_BOMBS_EASY))
    const [face, setFace] = useState<Face>(Face.smile)
    const [time, setTime] = useState<number>(0)
    const [started, setStarted] = useState<boolean>(false)
    const [lost, setLost] = useState<boolean>(false)
    const [won, setWon] = useState<boolean>(false)
    const [difficultLevel, setDifficultLevel] = useState<Difficult>(Difficult.easy)

    const [currentBombsCounter, setCurrentBombsCounter] = useState<number>(NUMBER_OF_BOMBS_EASY)

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
        console.log('handleCellClick')
        if (won || lost) {
            return
        }

        let newCells = cells.slice();

        // start the game
        if (!started) {
            let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
            while (isABomb) {
                newCells = generateCells(maxRows, maxCols, bombCounter);
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
            newCells = openMultipleCells(newCells, rowParam, colParam, maxRows, maxCols);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
        }

        // Check to see if you have won
        let safeClosedCellsExists = false;
        for (let row = 0; row < MAX_ROWS_EASY; row++) {
            for (let col = 0; col < MAX_COLS_EASY; col++) {
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
        console.log('handleCellContext')
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
        console.log('handleFaceClick')
        setStarted(false)
        setTime(0)
        setBombCounter(currentBombsCounter)
        setCells(generateCells(maxRows, maxCols, currentBombsCounter))
        setFace(Face.smile)
        setLost(false)
        setWon(false)
    }

    const toggleMouseClick = () => (e: React.MouseEvent): void => {
        console.log('toggleMouseClick')
        if (won || lost) {
            if (e.currentTarget.className !== "face") {
                return
            }
        }

        if (e.type === 'mousedown') {
            setFace(Face.oh)
        } else if (e.type === 'mouseup') {
            setFace(Face.smile)
        }
    }

    const renderedCells = useMemo(() => cells.map((row, rowIndex) => row.map((cell, colIndex) => (
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
    , [started, won, lost, difficultLevel, cells])

    const showAllBombs = (): Cell[][] => {
        console.log('showAllBombs')
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

    const onChangeDifficult = (level: Difficult): void => {
        console.log('onChangeDifficult')
        setFace(Face.smile)
        setTime(0)
        setWon(false)
        setLost(false)

        if (level === Difficult.easy) {
            setDifficultLevel(Difficult.easy)
            setMaxRows(MAX_ROWS_EASY)
            setMaxCols(MAX_COLS_EASY)
            setBombCounter(NUMBER_OF_BOMBS_EASY)
            setCurrentBombsCounter(NUMBER_OF_BOMBS_EASY)
            setCells(generateCells(MAX_ROWS_EASY, MAX_COLS_EASY, NUMBER_OF_BOMBS_EASY))
        }
        if (level === Difficult.normal) {
            setDifficultLevel(Difficult.normal)
            setMaxRows(MAX_ROWS_NORMAL)
            setMaxCols(MAX_COLS_NORMAL)
            setBombCounter(NUMBER_OF_BOMBS_NORMAL)
            setCurrentBombsCounter(NUMBER_OF_BOMBS_NORMAL)
            setCells(generateCells(MAX_ROWS_NORMAL, MAX_COLS_NORMAL, NUMBER_OF_BOMBS_NORMAL))
        }
        if (level === Difficult.hard) {
            setDifficultLevel(Difficult.hard)
            setMaxRows(MAX_ROWS_HARD)
            setMaxCols(MAX_COLS_HARD)
            setBombCounter(NUMBER_OF_BOMBS_HARD)
            setCurrentBombsCounter(NUMBER_OF_BOMBS_HARD)
            setCells(generateCells(MAX_ROWS_HARD, MAX_COLS_HARD, NUMBER_OF_BOMBS_HARD))
        }
    }

    if (!initialized) {
        return (
            <div className={'introScreen'}>
                {/*<div className={'introScreen'} style={ {backgroundImage: `url(${startScreenBackground})`} }>*/}
                <button onClick={() => setInitialized(true)}>
                    PLAY
                </button>
            </div>
        )
    }

    return (
        <div className={`Minesweeper`}>
            <SoundButtons isAppInit={initialized}/>
            <ThemeSwitcher/>
            <div className={"header"}>
                <NumberDisplay value={bombCounter}/>
                <div className={'face'} onClick={handleFaceClick} onMouseDown={toggleMouseClick()}>
                    <span> {face} </span>
                </div>
                <NumberDisplay value={time}/>
            </div>
            <div
                className={`body  ${difficultLevel === Difficult.easy ? 'difficult_easy' : ''}  ${difficultLevel === Difficult.normal ? 'difficult_normal' : ''}   ${difficultLevel === Difficult.hard ? 'difficult_hard' : ''} `}>
                {renderedCells}
            </div>
            <div className={'difficult'}>
                <DifficultChanger onChangeDifficult={onChangeDifficult} isGameStarted={started}/>
            </div>
        </div>
    )
}

export default Minesweeper