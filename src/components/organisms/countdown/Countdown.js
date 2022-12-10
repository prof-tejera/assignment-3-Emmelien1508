import { useContext, useEffect} from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Countdown.css'


export default function Countdown(props) {

    if (!props.running || props.completed) {
        return (
          <div className='countdown'>
                <TimePanel 
                    animated={props.running && !props.completed}
                    compact={props.compact ? props.compact : false}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                    index={props.index}
                    name={props.name}
                    size={props.size} 
                    subtitle={props.subtitle}
                />
          </div>
        )
    }

    return (
        <InnerCountdown 
            compact={props.compact ? props.compact : false}
            index={props.index}
            name={props.name}
            size={props.size} 
            subtitle={props.subtitle}
            timeStartValue={props.timeStartValue}
        />
    )
}

function InnerCountdown(props) {
    const {
        time, setTime,
        remainingTime, setRemainingTime,
        paused, stopped, handleTimerCompleted
    } = useContext(TimerContext)

    useEffect(() => {
        let interval = null

        if (!paused && !stopped) {
            if (time > 0) {
                interval = setInterval(() => {
                    setTime(time - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            }

            if (time === 0) {
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
        <div className='countdown'>
            <TimePanel 
                animated={!paused && !stopped && time > 0}
                compact={props.compact ? props.compact : false}
                currentTime={time} 
                duration={props.timeStartValue} 
                index={props.index}
                name={props.name}
                size={props.size} 
                subtitle={props.subtitle}
            />
        </div>
    )
}
