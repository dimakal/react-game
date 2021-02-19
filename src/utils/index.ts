import {MAX_COLS, MAX_ROWS, NUMBER_OF_BOMBS} from "../constants";
import {Cell, CellState, CellValue} from "../types";

const grabAllAdjacentCells = (cells: Cell[][], rowParam: number, colParam: number): {
    topLeftCell: Cell | null,
    topCell: Cell | null,
    topRightCell: Cell | null,
    rightCell: Cell | null,
    bottomRightCell: Cell | null,
    bottomCell: Cell | null,
    bottomLeftCell: Cell | null,
    leftCell: Cell | null,
} => {
    const topLeftCell = rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null
    const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null
    const topRightCell = rowParam > 0 && colParam < MAX_COLS ? cells[rowParam - 1][colParam + 1] : null
    const rightCell = colParam < MAX_COLS ? cells[rowParam][colParam + 1] : null
    const bottomRightCell = rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1 ? cells[rowParam + 1][colParam + 1] : null
    const bottomCell = rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null
    const bottomLeftCell = rowParam < MAX_ROWS - 1 && colParam > 0 ? cells[rowParam + 1][colParam - 1] : null
    const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null

    return {
        topLeftCell,
        topCell,
        topRightCell,
        rightCell,
        bottomRightCell,
        bottomCell,
        bottomLeftCell,
        leftCell,
    }
}

export const generateCells = (): Cell[][] => {
    let cells: Cell[][] = []

    // generating all cells
    for (let row = 0; row < MAX_ROWS; row++) {
        cells.push([])
        for (let col = 0; col < MAX_COLS; col++) {
            cells[row].push({
                value: CellValue.none,
                state: CellState.closed
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

            const {
                topLeftCell,
                    topCell,
                    topRightCell,
                    rightCell,
                    bottomRightCell,
                    bottomCell,
                    bottomLeftCell,
                    leftCell,
            } = grabAllAdjacentCells(cells, rowIndex, colIndex)

            if (topLeftCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (topCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (topRightCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (rightCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomRightCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (bottomLeftCell?.value === CellValue.bomb) {
                numberBombs++
            }
            if (leftCell?.value === CellValue.bomb) {
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

export const openMultipleCells = (cells: Cell[][], rowParam: number, colParam: number): Cell[][] => {

    let newCells = cells.slice()
    const currentCell = newCells[rowParam][colParam]

    newCells[rowParam][colParam].state = CellState.visible

    const {
        topLeftCell,
        topCell,
        topRightCell,
        rightCell,
        bottomRightCell,
        bottomCell,
        bottomLeftCell,
        leftCell,
    } = grabAllAdjacentCells(cells, rowParam, colParam)

    if (topLeftCell?.state === CellState.closed && topLeftCell.value !== CellValue.bomb) {
        if (topLeftCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam - 1, colParam - 1)
        } else {
            newCells[rowParam - 1][colParam - 1].state = CellState.visible
        }
    }

    if (topCell?.state === CellState.closed && topCell.value !== CellValue.bomb) {
        if (topCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam - 1, colParam)
        } else {
            newCells[rowParam - 1][colParam].state = CellState.visible
        }
    }

    if (topRightCell?.state === CellState.closed && topRightCell.value !== CellValue.bomb) {
        if (topRightCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam - 1, colParam + 1)
        } else {
            newCells[rowParam - 1][colParam + 1].state = CellState.visible
        }
    }

    if (rightCell?.state === CellState.closed && rightCell.value !== CellValue.bomb) {
        if (rightCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam, colParam + 1)
        } else {
            newCells[rowParam][colParam + 1].state = CellState.visible
        }
    }

    if (bottomRightCell?.state === CellState.closed && bottomRightCell.value !== CellValue.bomb) {
        if (bottomRightCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam + 1, colParam + 1)
        } else {
            newCells[rowParam + 1][colParam + 1].state = CellState.visible
        }
    }

    if (bottomCell?.state === CellState.closed && bottomCell.value !== CellValue.bomb) {
        if (bottomCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam + 1, colParam)
        } else {
            newCells[rowParam + 1][colParam].state = CellState.visible
        }
    }

    if (bottomLeftCell?.state === CellState.closed && bottomLeftCell.value !== CellValue.bomb) {
        if (bottomLeftCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam + 1, colParam - 1)
        } else {
            newCells[rowParam + 1][colParam - 1].state = CellState.visible
        }
    }

    if (leftCell?.state === CellState.closed && leftCell.value !== CellValue.bomb) {
        if (leftCell.value === CellValue.none) {
            cells = openMultipleCells(newCells, rowParam, colParam - 1)
        } else {
            newCells[rowParam][colParam - 1].state = CellState.visible
        }
    }

    return newCells
}