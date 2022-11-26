import { useState, createContext } from "react"

export const TimerContext = createContext({})

export default function TimerData({ children }) {
    const [count, setCount] = useState(0)
    const [round, setRound] = useState(0)
    const [interval, setInterv] = useState(0)
    const [remainingTime, setRemainingTime] = useState(0)
    const [activeTimerIndex, setActiveTimerIndex] = useState(0)
    const [timers, setTimers] = useState([])
    const [isPaused, setPaused] = useState(false)
    const [isStopped, setStopped] = useState(true)

    const markTimerComplete = () => {
        const newTimers = timers.map((timer, i) => {
            if (i === activeTimerIndex) {
                return { ...timer, isCompleted: true }
            }
            return timer
        })
        setTimers(newTimers)
    }

    const dispatcher = (posRef) => {
        if (activeTimerIndex + 1 < timers.length) {
            markTimerComplete()
            setCount(timers[activeTimerIndex + 1].startVal)

            if (
                timers[activeTimerIndex + 1].title === "XY" ||
                timers[activeTimerIndex + 1].title === "Tabata"
            ) {
                setRound(timers[activeTimerIndex + 1].roundStartVal)
            }
            if (timers[activeTimerIndex + 1].title === "Tabata") {
                setInterv(timers[activeTimerIndex + 1].intervalStartVal)
            }

            setActiveTimerIndex(activeTimerIndex + 1)
                posRef.current.scrollIntoView({ behavior: "smooth" })
        } else {
            const newTimers = timers.map((timer, i) => {
                return { ...timer, isRunning: false, isCompleted: false }
            })
            setTimers(newTimers)
            setStopped(true)
        }
    }

    return (
        <TimerContext.Provider
            value={{
                count,
                setCount,
                round,
                setRound,
                interval,
                setInterv,
                isPaused,
                setPaused,
                isStopped,
                setStopped,
                activeTimerIndex,
                setActiveTimerIndex,
                timers,
                setTimers,
                remainingTime,
                setRemainingTime,
                dispatcher,
            }}
        >
            {children}
        </TimerContext.Provider>
    )
}
