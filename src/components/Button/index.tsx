import React from 'react'
import './Button.scss'
import {CellState, CellValue} from "../../types";

interface ButtonProps {
    row: number
    col: number
    state: CellState
    value: CellValue,
    red?: boolean
    onClick: (rowParam: number, colParam: number) => (...args: any) => void
    onContext: (rowParam: number, colParam: number) => (...args: any) => void
    toggleMouseClick: () => (...args: any) => void
}

const Button: React.FC<ButtonProps> = ({
                                           row,
                                           col,
                                           state,
                                           value,
                                           onClick,
                                           onContext,
                                           red,
                                           toggleMouseClick
                                       }) => {

    const renderContent = (): React.ReactNode => {
        if (state == CellState.visible) {
            if (value === CellValue.bomb) {
                return <span> 💣 </span>
            } else if (value === CellValue.none) {
                return null
            }

            return value
        } else if (state === CellState.flagged) {
            return <span> 🚩 </span>
        }
    }

    return (
        <div
            className={`button ${state == CellState.visible ? 'visible' : ''} value-${value} ${state == CellState.flagged ? 'flagged' : ''} ${red ? 'red' : ''} `}
            onClick={onClick(row, col)}
            onContextMenu={onContext(row, col)}
            onMouseDown={toggleMouseClick()}
            onMouseUp={toggleMouseClick()}
        >
            {renderContent()}
        </div>
    )
}

export default Button