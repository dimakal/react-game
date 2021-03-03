import React from "react"
import './DifficultChanger.scss'
import {Difficult} from "../../types";

interface DifficultChangerProps {
    onChangeDifficult: (level: Difficult) => void,
    isGameStarted: boolean

}

const DifficultChanger: React.FC<DifficultChangerProps> = ({onChangeDifficult, isGameStarted}) => {

    return (
        <div className={'difficultChanger'}>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult(Difficult.easy)}> Easy </button>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult(Difficult.normal)}> Normal </button>
            <button disabled={isGameStarted} onClick={() => onChangeDifficult(Difficult.hard)}> Hard </button>
        </div>
    )
}

export default DifficultChanger