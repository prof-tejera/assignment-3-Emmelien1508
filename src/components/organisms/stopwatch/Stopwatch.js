import { useContext, useEffect } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Stopwatch.css'


export default function Stopwatch(props) {
    if (!props.running || props.completed) {
        return (
            <div className='stopwatch'>
                <TimePanel 
                    animated={props.running && !props.completed}
                    compact={props.compact ? props.compact : false}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeEndValue}
                    index={props.index}
                    name={props.name}
                    size={props.size} 
                    subtitle={props.subtitle}
                />
            </div>
        )
    }

    return (
        <InnerStopwatch 
            compact={props.compact ? props.compact : false}
            index={props.index}
            name={props.name}
            size={props.size} 
            subtitle={props.subtitle}
            timeEndValue={props.timeEndValue} 
        />
    )
}

function InnerStopwatch(props) {
    const {
        time, setTime,
        remainingTime, setRemainingTime,
        paused, stopped, handleTimerCompleted
    } = useContext(TimerContext)

    useEffect(() => {
        let interval = null

        if (!paused && !stopped) {
            if (time < props.timeEndValue) {
                interval = setInterval(() => {
                    setTime(time + 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            }

            if (time === props.timeEndValue) {
                handleTimerCompleted()
            }
        } else {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }
    }, [time, paused, stopped])

    return (
        <div className='stopwatch'>
            <TimePanel 
                animated={!paused && !stopped && time < props.timeEndValue}   
                compact={props.compact ? props.compact : false}
                currentTime={time} 
                duration={props.timeEndValue}
                index={props.index}
                name={props.name}
                size={props.size} 
                subtitle={props.subtitle}
            />
        </div>
    )
}