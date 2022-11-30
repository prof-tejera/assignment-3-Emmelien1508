import { useContext, useRef, useEffect} from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Countdown.css'


export default function Countdown(props) {
    if (!props.running || props.completed) {
        return (
          <div className='countdown'>
                <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
          </div>
        )
    }

    return (
        <InnerCountdown 
            timeStartValue={props.timeStartValue} 
            timeEndValue={props.timeEndValue} 
        />
    )
}

function InnerCountdown() {
    const {
        time, setTime,
        remainingTime, setRemainingTime,
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

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
        <div className='countdown' ref={ref}>
            <TimePanel time={time} />
        </div>
    )
}