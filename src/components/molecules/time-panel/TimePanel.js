import { useState } from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import PropTypes from 'prop-types'

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
    initialRoundStartValue,
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
                    {currentRound !== null && !compact && initialRoundStartValue && (
                        <p className='rounds'>
                            Round {animated ? initialRoundStartValue - currentRound + 1 : 1} / {initialRoundStartValue}
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

TimePanel.propTypes = {
    animated: PropTypes.bool,
    color: PropTypes.string,
    compact: PropTypes.bool,
    completed: PropTypes.bool,
    currentRound: PropTypes.number,
    currentTime: PropTypes.number,
    duration: PropTypes.number,
    index: PropTypes.number,
    name: PropTypes.string,
    initialRoundStartValue: PropTypes.number,
    running: PropTypes.bool,
    size: PropTypes.number,
    subtitle: PropTypes.string,
    title: PropTypes.string,
}