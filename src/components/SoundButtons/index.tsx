import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
// @ts-ignore
import MainMusic from '../../assets/music/main.mp3'
import './SoundButtons.scss'
import ReactHowler from "react-howler";

type SoundButtonsProps = {
    isAppInit: boolean
}

const SoundButtons: React.FC<SoundButtonsProps> = ({isAppInit}) => {

    const [playing, setPlaying] = useState<boolean>(false)
    const [volume, setVolume] = useState<number>(0.5)
    const [loop, setLoop] = useState<boolean>(true)
    const [mute, setMute] = useState<boolean>(false)

    useEffect(() => {
        if (isAppInit) {
            setPlaying(true)
        }
    }, [])

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(+e.target.value)
    }

    const onMuteSound = () => {
        setMute(!mute)
    }

    return (
        <div className={'soundButtons'}>
            <ReactHowler
                src={MainMusic}
                playing={playing}
                volume={volume}
                loop={loop}
                mute={mute}
            />
            <div className={'playButtons'}>
                <button onClick={() => setPlaying(true)}>▶️</button>
                <button onClick={() => setPlaying(false)}>⏸️</button>
            </div>

            <div className={`volume ${mute ? 'disabled' : ''}`} >
                <label>
                    Volume: <br/>
                    <span className='slider-container'>
                      <input className={'slider'}
                          disabled={mute}
                          type='range'
                          min='0'
                          max='1'
                          step='.1'
                          value={volume}
                          onChange={handleVolumeChange}
                      />
                    </span>
                    {volume * 100}
                </label>
            </div>
            <label className={'mute'}>
                Mute:
                <input type="checkbox" checked={mute} onChange={onMuteSound} />
            </label>
        </div>
    )
}

export default SoundButtons