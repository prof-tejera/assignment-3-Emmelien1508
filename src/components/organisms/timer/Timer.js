import { useContext, useEffect, useState } from "react";
import { TimerContext } from "../../../context/TimerContext";
import TimePanel from "../../molecules/time-panel/TimePanel";

export default function Timer(props) {
    let data = { ...props }

    if (!props.running || props.completed) {
        return (
            <div className={props.name}>
                <TimePanel {...data} />
            </div>
        )
    }

    return (
        <InnerTimer {...data} />
    )
}

function InnerTimer(props) {
    const {
        time, setTime, restTime, setRestTime, 
        setRemainingTime, round, setRound, 
        paused, stopped, handleTimerCompleted
    } = useContext(TimerContext)
    const [isWorkTime, setIsWorkTime] = useState(true)

    function increaseTime() {
        setTime((time) => time + 1)
        setRemainingTime((remainingTime) => remainingTime - 1)
    }

    function decreaseTime() {
        setTime((time) => time - 1)
        setRemainingTime((remainingTime) => remainingTime - 1)
    }

    function decreaseRestTime() {
        setRestTime((restTime) => restTime - 1)
        setRemainingTime((remainingTime) => remainingTime - 1)
    }

    function resetRound() {
        setRound(round - 1)
        setTime(props.timeStartValue)
    }

    function resetRestTime() {
        setIsWorkTime(true)
        setRestTime(props.restTimeStartValue)
    }

    useEffect(() => {
        let interval = null
        let restInterval = null
        const timeNotEnded = props.name === 'Stopwatch' ? time <= props.timeEndValue : time > 0
        const restTimeNotEnded = time === 0 && restTime > 0

        if (!paused && !stopped) {
            if (props.name === 'Stopwatch') {
                if (timeNotEnded) { 
                    interval = setInterval(() => increaseTime(), 1000) 
                }

                if (time === props.timeEndValue) { 
                    handleTimerCompleted() 
                }
            } else if (props.name === 'Countdown') {
                if (timeNotEnded) { 
                    interval = setInterval(() => decreaseTime(), 1000) 
                }

                if (time === 0) { 
                    handleTimerCompleted() 
                }
            } else if (props.name === 'XY') {
                if (timeNotEnded) { 
                    interval = setInterval(() => decreaseTime(), 1000) 
                }

                if (round - 1 > 0 && time === 0) { 
                    resetRound() 
                }

                if (round === 1 && time === 0) { 
                    handleTimerCompleted() 
                }
            } else {
                if (timeNotEnded) {
                    setIsWorkTime(true)
                    interval = setInterval(() => decreaseTime(), 1000)
                } else if (restTimeNotEnded) {
                    setIsWorkTime(false)
                    restInterval = setInterval(() => decreaseRestTime(), 1000)
                } else if (round > 1 && time === 0 && restTime === 0) {
                    resetRound()
                    resetRestTime()
                }

                if (round === 1 && time === 0 && restTime === 0) { 
                    handleTimerCompleted() 
                }
            }
        } else {
            clearInterval(interval)
            clearInterval(restInterval)
        }

        return () => {
            clearInterval(interval)
            clearInterval(restInterval)
        }
    }, [round, time, restTime, paused, stopped])

    let data = { ...props }
    data.animated = (!paused && !stopped) && (time > 0 || (time === 0 && restTime > 0))
    data.currentTime = (data.name === 'Tabata' && !isWorkTime ) ? restTime : time
    
    if (data.name === 'Tabata') {
        data.title = !isWorkTime ? 'Rest 🧘🏼' : 'Work 🏋🏼'
        if (!paused && !stopped && time === 0 && restTime === 0) {
            data.currentRound = 0
        }
    }

    if (data.name === 'Tabata' || data.name === 'XY') {
        data.currentRound = round
    }

    return (
        <div className={props.name}>
            <TimePanel {...data} />
        </div>
    )
}
