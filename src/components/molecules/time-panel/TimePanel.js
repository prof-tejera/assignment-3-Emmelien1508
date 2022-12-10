import './TimePanel.css'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useState } from 'react'

export default function TimePanel(props) {
    const [key, setKey] = useState(props.index)
    console.log("these are the time panel props")
    console.log(props)
    const children = ({ remainingTime }) => {
        const currentRound = props.animated ? props.roundStartValue - props.currentRound + 1 : 1

        return (
            <div className='text-center'>
                {props.name && (<p>{props.name}</p>)}
                {props.subtitle && (<p className='text-xs'>{props.subtitle}</p>)}
                {props.title && (<p>{props.title}</p>)}
                {props.currentRound !== null && props.roundStartValue && (
                    <p className='rounds'>
                        Round {currentRound} / {props.roundStartValue}
                    </p>
                )}
                <p className='text-xl'>{props.currentTime}</p>
            </div>
        )
    }

    return (
        <div className={`time-panel ${props.classes ? props.classes : ''} ${props.animated ? 'animated' : ''}`}>
            <CountdownCircleTimer
                isPlaying={props.animated}
                duration={props.duration}
                strokeWidth={4}
                key={key}
                size={props.size ? props.size : 240}
                colors={['#9D00FF']}
                onComplete={() => {
                    setKey(prevKey => prevKey + 1)
                }}
            >
                {children}
            </CountdownCircleTimer>
        </div>
    )
}