import { useEffect, useContext, useRef } from "react"

import { TimerContext } from "../../../context/TimerContext"
import RoundPanel from "../../molecules/round-panel/RoundPanel"
import TimePanel from "../../molecules/time-panel/TimePanel"

import './Tabata.css'


export default function Tabata(props) {
    if (!props.isRunning || props.isCompleted) {
        return (
            <div className="tabata">
                <TimePanel time={props.isCompleted ? props.endVal : props.startVal} />
                <TimePanel time={props.isCompleted ? props.intervalEndVal : props.intervalStartVal} />
                <RoundPanel round={props.isCompleted ? props.roundEndVal : props.roundStartVal} />
            </div>
        )
    }
    
      return (
            <InnerTabata
                startVal={props.startVal}
                endVal={props.endVal}
                roundStartVal={props.roundStartVal}
                roundEndVal={props.roundEndVal}
                intervalStartVal={props.intervalStartVal}
                intervalEndVal={props.intervalEndVal}
            />
      )
}

function InnerTabata(props) {
    const {
        count,
        setCount,
        round,
        setRound,
        interval,
        setInterv,
        isPaused,
        isStopped,
        remainingTime,
        setRemainingTime,
        dispatcher,
    } = useContext(TimerContext)
    const posRef = useRef()

    useEffect(() => {
        let time
    
        if (isPaused || isStopped) {
            if (time) {
                clearTimeout(time)
            }
        }
    
        if (!isPaused && !isStopped) {
            if (count > 0) {
                time = setTimeout(() => {
                    setCount(count - 10)
                    setRemainingTime(remainingTime - 10)
                }, 10)
            }
        
            if (count === 0 && interval > 0) {
                time = setTimeout(() => {
                    setInterv(interval - 10)
                    setRemainingTime(remainingTime - 10)
                }, 10)
            }
    
            if (round - 1 > 0 && count === 0 && interval === 0) {
                setRound(round - 1)
                setCount(props.startVal)
                setInterv(props.intervalStartVal)
            }
    
            if (round === 1 && count === 0 && interval === 0) {
                dispatcher(posRef)
            }
        }
    
        return () => {
            if (time) {
                clearTimeout(time)
            }
        }
    }, [round, count, interval, isPaused, isStopped])
    
    let intervalTime = interval ? interval : 0
    return (
        <div ref={posRef}>
            <h4>Work 🏋🏼</h4>
            <TimePanel time={count} />
            <h4>Rest 🧘🏼</h4>
            <TimePanel time={intervalTime} />
            <RoundPanel round={round} />
        </div>
    )
}