import {MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS} from "../constants";
import {Cell, CellState, CellValue} from "../types";

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = []

    // generating all cells
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([])
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            })
        }
    }

    // randomly put 10 bombs
    let bombsPlaced = 0
    while (bombsPlaced < NUMBER_OF_BOMBS) {
        const randomRow = Math.floor(Math.random() * MAX_ROWS)
        const randomColumn = Math.floor(Math.random() * MAX_COLS)
        const currentCell = cells[randomRow][randomColumn]
        if (currentCell.value !== CellValue.bomb) {
            cells[randomRow][randomColumn] = {
                ...cells[randomColumn][randomRow], value: CellValue.bomb
            }
        }
        bombsPlaced++
    }

    // calculate numbers for each cell
    for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
        for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
            const currentCell = cells[rowIndex][colIndex]
            if (currentCell.value === CellValue.bomb) {
                continue
            }

            let numberBombs = 0
            const topLeftBomb = rowIndex > 0 && colIndex > 0 ? cells[rowIndex - 1][colIndex - 1] : null
            const topBomb = rowIndex > 0 ? cells[rowIndex - 1][colIndex] : null
            const topRightBomb = rowIndex > 0 && colIndex < MAX_COLS ? cells[rowIndex - 1][colIndex + 1] : null
            const rightBomb = colIndex < MAX_COLS ? cells[rowIndex][colIndex + 1] : null
            const bottomRightBomb = rowIndex < MAX_ROWS - 1 && colIndex < MAX_COLS - 1 ? cells[rowIndex + 1][colIndex + 1] : null
            const bottomBomb = rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][colIndex] : null
            const bottomLeftBomb = rowIndex < MAX_ROWS - 1 && colIndex > 0 ? cells[rowIndex + 1][colIndex - 1] : null
            const leftBomb = colIndex > 0 ? cells[rowIndex][colIndex - 1] : null

            if (topLeftBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (topBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (topRightBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (rightBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomRightBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomLeftBomb?.value === CellValue.bomb) {
                numberBombs++
            }
            if (leftBomb && leftBomb.value === CellValue.bomb) {
                numberBombs++
            }

            if (numberBombs > 0) {
                cells[rowIndex][colIndex] = {
                    ...currentCell,
                    value: numberBombs
                }
            }
        }
    }

    return cells
}