import { createContext, useEffect, useState } from 'react'


export const TimerContext = createContext({})

export default function Timers({ children }) {
    const [time, setTime] = useState(0)
    const [round, setRound] = useState(0)
    const [restTime, setRestTime] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0)
    const [timers, setTimers] = useState([])
    const [history, setHistory] = useState([])
    const [paused, setPaused] = useState(false)
    const [stopped, setStopped] = useState(true)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        const storedTimers = JSON.parse(localStorage.getItem('timers'))
        if (timers === null || timers.length === 0) {
            localStorage.setItem('timers', JSON.stringify(storedTimers))
        } else {
            localStorage.setItem('timers', JSON.stringify(timers))
        }
    }, [timers])

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('history'))
        if (history === null || history.length === 0) {
            localStorage.setItem('history', JSON.stringify(storedHistory))
        } else {
            localStorage.setItem('history', JSON.stringify(history))
        }
    }, [history])

    useEffect(() => {
        if (showConfetti) {
            setTimeout(() => {
                setShowConfetti(false)
            }, 5000)
        }
    }, [showConfetti])
    
    function setTimerComplete() {
        const newTimers = timers.map((timer, index) => {
            if (currentTimerIndex === index) {
                return {...timer, completed: true}
            }
            return timer
        })
        setTimers(newTimers)
        localStorage.setItem('timers', JSON.stringify(newTimers))
    }

    function handleTimerCompleted(timer) {
        if (currentTimerIndex + 1 < timers.length) {
            setTimerComplete()
            setTime(timers[currentTimerIndex + 1].timeStartValue)

            if (timers[currentTimerIndex + 1].name === 'XY' || timers[currentTimerIndex + 1].name === 'Tabata') {
                setRound(timers[currentTimerIndex + 1].roundStartValue)
            }

            if (timers[currentTimerIndex + 1].name === 'Tabata') {
                setRestTime(timers[currentTimerIndex + 1].restTimeStartValue)
            }

            setCurrentTimerIndex(currentTimerIndex + 1)
            timer.current.scrollIntoView({ behavior: "smooth" })
        } else {    
            addWorkoutToHistory()
            resetTimers()
            setStopped(true)
            setShowConfetti(true)
        }
    } 

    function resetTimers() {
        setTimers([])
        localStorage.setItem('timers', JSON.stringify([]))
    }

    function addWorkoutToHistory() {
        const newTimers = timers.map((timer, index) => {
            return {...timer, running: false, completed: true}
        })
        const newHistory = history !== null ? [...history, newTimers] : [newTimers]
        setHistory(newHistory)
        localStorage.setItem('history', JSON.stringify(newHistory))
    }

    return (
        <TimerContext.Provider
            value={{
                time, setTime, restTime, setRestTime, 
                remainingTime, setRemainingTime, round, setRound, 
                paused, setPaused, stopped, setStopped, 
                currentTimerIndex, setCurrentTimerIndex, timers, setTimers, 
                handleTimerCompleted, showConfetti, setShowConfetti
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}