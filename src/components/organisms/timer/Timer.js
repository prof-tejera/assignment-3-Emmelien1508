import { useContext, useEffect, useRef, useState } from "react"

import TimePanel from "../../molecules/time-panel/TimePanel"

import { TimerContext } from "../../../context/TimerContext"
import { useSearchParams } from "react-router-dom"


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
        time, setTime, restTime, setRestTime, remainingTime,
        setRemainingTime, round, setRound, currentTimerIndex,
        paused, stopped, handleTimerCompleted, timers
    } = useContext(TimerContext)
    const timer = useRef()
    const [isWorkTime, setIsWorkTime] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() => {
        if (!stopped && remainingTime > 0) {
            const newTimers = timers.map((timer, index) => {
                return {...timer, currentTime: index === currentTimerIndex ? time : 0}
            })

            const params = {
                ...searchParams,
                'current-timer-index': currentTimerIndex,
                'paused': paused,
                'remaining-time': remainingTime,
                'rest-time': restTime,
                'round': round,
                'stopped': stopped,
                'time': time,
                'is-work-time': isWorkTime,
                'timers': JSON.stringify(newTimers)
            }

            setSearchParams(params)
        }
    
    }, [currentTimerIndex, time, restTime, remainingTime, round])

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
                    handleTimerCompleted(timer) 
                }
            } else if (props.name === 'Countdown') {
                if (timeNotEnded) { 
                    interval = setInterval(() => decreaseTime(), 1000) 
                }

                if (time === 0) { 
                    handleTimerCompleted(timer) 
                }
            } else if (props.name === 'XY') {
                if (timeNotEnded) { 
                    interval = setInterval(() => decreaseTime(), 1000) 
                }

                if (round - 1 > 0 && time === 0) { 
                    resetRound() 
                }

                if (round === 1 && time === 0) { 
                    handleTimerCompleted(timer) 
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
                    handleTimerCompleted(timer) 
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
        <div className={props.name} ref={timer}>
            <TimePanel {...data} />
        </div>
    )
}
