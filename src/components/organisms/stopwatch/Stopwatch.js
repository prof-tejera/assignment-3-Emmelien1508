import { useContext, useRef, useEffect } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Stopwatch.css'


export default function Stopwatch(props) {
    if (!props.running || props.completed) {
        return (
            <div className='stopwatch'>
                <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
            </div>
        )
    }

    return (
        <InnerStopwatch 
            timeStartValue={props.timeStartValue} 
            timeEndValue={props.timeEndValue} 
        />
    )
}

function InnerStopwatch(props) {
    const {
        time, setTime,
        remainingTime, setRemainingTime,
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

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
                dispatcher(ref)
            }
        } else {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }
    }, [time, paused, stopped])

    return (
        <div className='stopwatch' ref={ref}>
            <TimePanel time={time} />
        </div>
    )
}