import { useEffect, useContext, useRef } from 'react'
import { TimerContext } from '../../../context/TimerContext'
import RoundPanel from '../../molecules/round-panel/RoundPanel'
import TimePanel from '../../molecules/time-panel/TimePanel'


export default function Tabata(props) {
    if (!props.running || props.completed) {
        return (
            <div>
                <TimePanel time={props.completed ? props.endTimeValue : props.startTimeValue} />
                <TimePanel time={props.completed ? props.restTimeEndValue : props.restTimeStartValue} />
                <RoundPanel round={props.completed ? props.roundEndValue : props.roundStartValue} />
            </div>
        )
    }
    
      return (
            <InnerTabata
                startTimeValue={props.startTimeValue}
                endTimeValue={props.endTimeValue}
                roundStartValue={props.roundStartValue}
                roundEndValue={props.roundEndValue}
                restTimeStartValue={props.restTimeStartValue}
                restTimeEndValue={props.restTimeEndValue}
            />
      )
}

function InnerTabata(props) {
    const {
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

    useEffect(() => {
        let currentTime
    
        if (paused || stopped) {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    
        if (!paused && !stopped) {
            if (time > 0) {
                currentTime = setTimeout(() => {
                    setTime(time - 10)
                    setRemainingTime(remainingTime - 10)
                }, 10)
            }
        
            if (time === 0 && restTime > 0) {
                currentTime = setTimeout(() => {
                    setRestTime(restTime - 10)
                    setRemainingTime(remainingTime - 10)
                }, 10)
            }
    
            if (round > 1 && time === 0 && restTime === 0) {
                setRound(round - 1)
                setTime(props.startTimeValue)
                setRestTime(props.restTimeStartValue)
            }
    
            if (round === 1 && time === 0 && restTime === 0) {
                dispatcher(ref)
            }
        }
    
        return () => {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    }, [round, time, restTime, paused, stopped])
    
    return (
        <div ref={ref}>
            <h4>Work 🏋🏼</h4>
            <TimePanel time={time} />
            <h4>Rest 🧘🏼</h4>
            <TimePanel time={restTime ? restTime : 0} />
            <RoundPanel round={round} />
        </div>
    )
}