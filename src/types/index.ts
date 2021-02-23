export enum CellValue {
    none,
    one,
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    bomb
}

export enum CellState {
    closed,
    visible,
    flagged
}

export type Cell = { value: CellValue, state: CellState, red?: boolean}

export enum Face {
    smile = '😀',
    oh = '😮',
    lost = '😵',
    won = '😎'
}

export enum Difficult {
    easy,
    normal,
    hard
}