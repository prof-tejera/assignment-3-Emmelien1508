import { useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

import './TimePanel.css'


export default function TimePanel({
    animated,
    color,
    compact,
    completed,
    currentRound,
    currentTime,
    duration,
    index,
    name,
    roundStartValue,
    running,
    size,
    subtitle,
    title
}) {
    const [key, setKey] = useState(index)
    const time = ({ remainingTime }) => {
        return (
            <div className='text-center'>
                {title && !compact && (<p>{title}</p>)}
                {running && !completed && (
                    <p className={`${size === 100 ? 'text-md' : 'text-xl'} ${animated ? 'glowing' : ''}`}>
                        {currentTime}
                    </p>
                )}

                {!running && !completed && (
                    <p className={`${size === 100 ? 'text-md' : 'text-xl'}`}>
                        {currentTime}
                    </p>
                )}

                {!running && completed && (
                    <p className={`${size === 100 ? 'text-md' : 'text-xl'}`}>
                        {duration}
                    </p>
                )}
                <p className={`${size === 100 ? 'text-xs' : 'text-sm'}`}>seconds</p>
            </div>
        )
    }

    return (
            <div className={`time-panel ${animated ? 'animated' : ''}`}>
                <div className='time-panel-information'>
                    {name && (<p className='text-lg'>{name}</p>)}
                    {subtitle && (<p className='text-xs'>{subtitle}</p>)}
                    {currentRound !== null && !compact && roundStartValue && (
                        <p className='rounds'>
                            Round {animated ? roundStartValue - currentRound + 1 : 1} / {roundStartValue}
                        </p>
                    )}
                </div>

                <CountdownCircleTimer
                    trailColor='#fff'
                    isPlaying={animated}
                    duration={duration}
                    strokeWidth={4}
                    key={key}
                    size={size ? size : 240}
                    colors={color ? [color] : ['#c925ff']}
                    onComplete={() => {
                        setKey(prevKey => prevKey + 1)
                    }}
                >
                    {time}
                </CountdownCircleTimer>
            </div>
    )
}