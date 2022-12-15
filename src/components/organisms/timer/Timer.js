import { useContext, useEffect, useRef, useState } from "react"

import TimePanel from "../../molecules/time-panel/TimePanel"

import { TimerContext } from "../../../context/TimerContext"
import { useSearchParams } from "react-router-dom"


export default function Timer({
    animated,
    compact,
    completed,
    currentRound,
    currentTime,
    duration,
    index,
    name,
    restTimeEndValue,
    restTimeStartValue,
    roundEndValue,
    roundStartValue,
    running,
    size,
    subtitle,
    timeEndValue,
    timeStartValue,
    title,
}) {

    if (!running || completed) {
        return (
            <div className={name}>
                <TimePanel 
                    animated={animated}
                    compact={compact}
                    completed={completed}
                    currentRound={currentRound}
                    currentTime={currentTime}
                    duration={duration}
                    index={index}
                    name={name}
                    restTimeEndValue={restTimeEndValue}
                    restTimeStartValue={restTimeStartValue}
                    roundEndValue={roundEndValue}
                    roundStartValue={roundStartValue}
                    running={running}
                    size={size}
                    subtitle={subtitle}
                    timeEndValue={timeEndValue}
                    timeStartValue={timeStartValue}
                    title={title} 
                />
            </div>
        )
    }

    return (
        <InnerTimer 
            animated={animated}
            compact={compact}
            completed={completed}
            currentRound={currentRound}
            currentTime={currentTime}
            duration={duration}
            index={index}
            name={name}
            restTimeEndValue={restTimeEndValue}
            restTimeStartValue={restTimeStartValue}
            roundEndValue={roundEndValue}
            roundStartValue={roundStartValue}
            running={running}
            size={size}
            subtitle={subtitle}
            timeEndValue={timeEndValue}
            timeStartValue={timeStartValue}
            title={title} 
        />
    )
}

function InnerTimer({
    compact,
    completed,
    currentRound,
    duration,
    index,
    name,
    restTimeEndValue,
    restTimeStartValue,
    roundEndValue,
    roundStartValue,
    running,
    size,
    subtitle,
    timeEndValue,
    timeStartValue,
    title,
}) {
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

            searchParams.set('current-timer-index', `${currentTimerIndex}`)
            searchParams.set('rest-time', `${restTime}`)
            searchParams.set('round', `${round}`)
            searchParams.set('time', `${time}`)
            searchParams.set('is-work-time', `${isWorkTime}`)
            searchParams.set('timers', JSON.stringify(newTimers))
            searchParams.set('remaining-time', `${remainingTime}`)
            setSearchParams(searchParams)
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
        setTime(timeStartValue)
    }

    function resetRestTime() {
        setIsWorkTime(true)
        setRestTime(restTimeStartValue)
    }

    useEffect(() => {
        let interval = null
        let restInterval = null
        const timeNotEnded = name === 'Stopwatch' ? time <= timeEndValue : time > 0
        const restTimeNotEnded = time === 0 && restTime > 0

        if (!paused && !stopped) {
            if (name === 'Stopwatch') {
                if (timeNotEnded) { 
                    interval = setInterval(() => increaseTime(), 1000) 
                }

                if (time === timeEndValue) { 
                    handleTimerCompleted(timer) 
                }
            } else if (name === 'Countdown') {
                if (timeNotEnded) { 
                    interval = setInterval(() => decreaseTime(), 1000) 
                }

                if (time === 0) { 
                    handleTimerCompleted(timer) 
                }
            } else if (name === 'XY') {
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

    let data = {   
        compact,
        completed,
        currentRound,
        duration,
        index,
        name,
        roundStartValue,
        running,
        size,
        subtitle,
        title
    }
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
        <div className={name} ref={timer}>
            <TimePanel {...data} />
        </div>
    )
}
