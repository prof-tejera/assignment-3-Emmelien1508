import { useContext, useEffect} from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Countdown.css'


export default function Countdown(props) {

    if (!props.running || props.completed) {
        return (
          <div className='countdown'>
                <TimePanel 
                    name={props.name}
                    subtitle={props.subtitle}
                    index={props.index}
                    animated={props.running && !props.completed}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                />
          </div>
        )
    }

    return (
        <InnerCountdown 
            name={props.name}
            subtitle={props.subtitle}
            timeStartValue={props.timeStartValue}
            index={props.index}
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
                name={props.name}
                subtitle={props.subtitle}
                index={props.index}
                animated={!paused && !stopped && time > 0}
                currentTime={time} 
                duration={props.timeStartValue} 
            />
        </div>
    )
}
