import { useContext, useRef, useEffect} from 'react'
import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'


export default function Countdown(props) {
    if (!props.running || props.completed) {
        return (
          <div>
                <TimePanel time={props.completed ? props.endTimeValue : props.startTimeValue} />
          </div>
        )
    }

    return <InnerCountdown startTimeValue={props.startTimeValue} endTimeValue={props.endTimeValue} />
}

function InnerCountdown(props) {
    const {
        time, setTime, remainingTime, setRemainingTime,
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

    useEffect(() => {
        let currentTime
    
        if (!paused && !stopped) {
            if (time > 0) {
                currentTime = setTimeout(() => {
                setTime(time - 10)
                setRemainingTime(remainingTime - 10)
                }, 10)
            }
        
            if (time === 0) {
                dispatcher(ref)
            }
        }
    
        return () => {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    }, [time, paused, stopped])

    return (
        <div ref={ref}>
            <TimePanel time={time} />
        </div>
    )
}