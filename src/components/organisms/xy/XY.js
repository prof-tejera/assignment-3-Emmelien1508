import { useEffect, useContext, useRef } from 'react'
import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'
import RoundPanel from '../../molecules/round-panel/RoundPanel'

export default function XY(props) {
    if (!props.running || props.completed) {
        return (
          <div>
                <TimePanel time={props.completed ? props.endTimeValue : props.startTimeValue} />
                <RoundPanel round={props.completed ? props.roundEndValue : props.roundStartValue} />
          </div>
        )
    }
    
    return (
        <InnerXY
            startTimeValue={props.startTimeValue}
            endTimeValue={props.endTimeValue}
            roundStartValue={props.roundStartValue}
            roundEndValue={props.roundEndValue}
        />
    )
}

function InnerXY(props) {
    const {
        time, setTime, remainingTime, setRemainingTime, 
        round, setRound, paused, stopped, dispatcher
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
        
            if (round > 1 && time === 0) {
                setRound(round - 1)
                setTime(props.startTimeValue)
            }
        
            if (round === 1 && time === 0) {
                dispatcher(ref)
            }
        }
    
        return () => {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    }, [round, time, paused, stopped])
    
    return (
        <div ref={ref}>
            {!stopped && !paused && <RoundPanel round={round} />}
            <TimePanel time={time} />
        </div>
    )
}