
import TimePanel from '../../molecules/time-panel/TimePanel'
import './Stopwatch.css'
import { useContext, useRef, useEffect } from 'react'
import { TimerContext } from '../../../context/TimerContext'

export default function Stopwatch(props) {
    if (!props.isRunning || props.isCompleted) {
        return (
            <div className="main-panel">
                <TimePanel time={props.isCompleted ? props.endVal : props.startVal} />
            </div>
        )
    }

    return <InnerStopwatch startVal={props.startVal} endVal={props.endVal} />
}

function InnerStopwatch(props) {
    const {
        count,
        setCount,
        isPaused,
        isStopped,
        remainingTime,
        setRemainingTime,
        dispatcher,
    } = useContext(TimerContext)
    const posRef = useRef()

    useEffect(() => {
        let time
    
        if (!isPaused && !isStopped) {
            if (count < props.endVal) {
                time = setTimeout(() => {
                    setCount(count + 10)
                    setRemainingTime(remainingTime - 10)
                }, 10)
            }
        
            if (count === props.endVal) {
                dispatcher(posRef)
            }
        }
    
        return () => {
            if (time) {
                clearTimeout(time)
            }
        }
    }, [count, props.endVal, isPaused, isStopped])

    return (
        <div className="stopwatch" ref={posRef}>
            <TimePanel time={count} />
        </div>
    )
}