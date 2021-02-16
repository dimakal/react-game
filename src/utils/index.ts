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


    return cells
}