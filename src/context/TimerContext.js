import { createContext, useState } from "react"

export const TimerContext = createContext({})

export default function Timers({ children }) {
    const [time, setTime] = useState(0)
    const [round, setRound] = useState(0)
    const [restTime, setRestTime] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)
    const [currentTimerIndex, setCurrentTimerIndex] = useState(0)
    const [timers, setTimers] = useState([])
    const [paused, setPaused] = useState(false)
    const [stopped, setStopped] = useState(true)
    
    function setTimerComplete() {
        const newTimers = timers.map((timer, index) => {
            if (currentTimerIndex === index) {
                return {...timer, completed: true}
            }
            return timer
        })
        setTimers(newTimers)
    }

    function dispatcher(ref) {
        if (currentTimerIndex + 1< timers.length) {
            setTimerComplete()
            setTime(timers[currentTimerIndex + 1].startValue)

            if (timers[currentTimerIndex + 1].name === 'XY' || timers[currentTimerIndex + 1].name === 'Tabata') {
                setRound(timers[currentTimerIndex + 1].roundStartValue)
            }

            if (timers[currentTimerIndex + 1].name === 'Tabata') {
                setRestTime(timers[currentTimerIndex + 1].restTimeStartValue)
            }

            setCurrentTimerIndex(currentTimerIndex + 1)
            ref.current.scrollIntoView({ behavior: "smooth" })
        } else {
            const newTimers = timers.map((timer) => {
                return {...timer, running: false, completed: false}
            })
            setTimers(newTimers)
            setStopped(true)
        }
    } 

    return (
        <TimerContext.Provider
            value={{
                time, setTime, restTime, setRestTime, 
                remainingTime, setRemainingTime, round, setRound, 
                paused, setPaused, stopped, setStopped, 
                currentTimerIndex, setCurrentTimerIndex, timers, setTimers, 
                dispatcher
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}