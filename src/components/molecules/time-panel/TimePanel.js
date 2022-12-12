import { useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import './TimePanel.css'


export default function TimePanel(props) {
    const [key, setKey] = useState(props.index)
    const children = ({ remainingTime }) => {
        return (
            <div className='text-center'>
                {props.title && !props.compact && (<p>{props.title}</p>)}
                {props.running && !props.completed && (
                    <p className={`${props.size === 100 ? 'text-md' : 'text-xl'} ${props.animated ? 'glowing' : ''}`}>
                        {props.currentTime}
                    </p>
                )}

                {!props.running && !props.completed && (
                    <p className={`${props.size === 100 ? 'text-md' : 'text-xl'}`}>
                        {props.currentTime}
                    </p>
                )}

                {!props.running && props.completed && (
                    <p className={`${props.size === 100 ? 'text-md' : 'text-xl'}`}>
                        {props.duration}
                    </p>
                )}
                <p className={`${props.size === 100 ? 'text-xs' : 'text-sm'}`}>seconds</p>
            </div>
        )
    }

    return (
            <div className={`time-panel ${props.animated ? 'animated' : ''}`}>
                <div className='time-panel-information'>
                    {props.name && (<p className='text-lg'>{props.name}</p>)}
                    {props.subtitle && (<p className='text-xs'>{props.subtitle}</p>)}
                    {props.currentRound !== null && !props.compact && props.roundStartValue && (
                        <p className='rounds'>
                            Round {props.animated ? props.roundStartValue - props.currentRound + 1 : 1} / {props.roundStartValue}
                        </p>
                    )}
                </div>
                    <CountdownCircleTimer
                        isPlaying={props.animated}
                        duration={props.duration}
                        strokeWidth={4}
                        key={key}
                        size={props.size ? props.size : 240}
                        colors={['#c925ff']}
                        onComplete={() => {
                            setKey(prevKey => prevKey + 1)
                        }}
                    >
                        {children}
                    </CountdownCircleTimer>
            </div>
    )
}