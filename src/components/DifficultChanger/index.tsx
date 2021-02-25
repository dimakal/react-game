import React from "react"
import './DifficultChanger.scss'

interface DifficultChangerProps {
    onChangeDifficult: (level: string) => void,
    isGameStarted: boolean

}

const DifficultChanger: React.FC<DifficultChangerProps> = ({onChangeDifficult, isGameStarted}) => {

    return (
        <div className={'difficultChanger'}>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult('easy')}> Easy </button>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult('normal')}> Normal </button>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult('hard')}> Hard </button>
        </div>
    )
}

export default DifficultChanger