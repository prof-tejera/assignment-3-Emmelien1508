import { Link } from "react-router-dom"
import { useContext, useEffect, useRef } from "react"
import { TimerContext } from "../../../context/TimerContext"
import { workoutIsDone, calculateWorkoutTime, getTotalFastForwardTime } from "../../../utils/helpers"
import Button from "../../atoms/button/Button"
import TimePanel from "../../molecules/time-panel/TimePanel"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

import './Workout.css'

export default function Workout() {
    const {
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
    } = useContext(TimerContext)

    const workoutRunningTime = useRef(0)

    useEffect(() => {
        if (isStopped) {
            workoutRunningTime.current = calculateWorkoutTime(timers)
            setRemainingTime(workoutRunningTime.current)
        }
    }, [timers, isStopped])

    const removeTimer = (index) => {
        const newTimers = timers.filter((timer, i) => i !== index)
        setTimers(newTimers)
    }

    const workoutIsFinished = workoutIsDone(timers)
    const pauseLabel = isPaused ? "Resume" : "Pause"

    function handleStart() {
        const newTimers = timers.map((timer, i) => {
            return { ...timer, isRunning: false, isCompleted: false }
        })
        setTimers(newTimers)
        setCount(timers[0].startVal)

        if (timers[0].title === "XY" || timers[0].title === "Tabata") {
            setRound(timers[0].roundStartVal)
        }
        if (timers[0].title === "Tabata") {
            setInterv(timers[0].intervalStartVal)
        }

        setActiveTimerIndex(0)
        setStopped(false)
        setPaused(false)
    }

    function handlePause() {
        setPaused(!isPaused)
    }

    function handleReset() {
        const newTimers = timers.map((timer, i) => {
            return { ...timer, isRunning: false, isCompleted: false }
            })
        setTimers(newTimers)
        setStopped(true)
        setActiveTimerIndex(999)
    }

    function handleFastForward() {
        if (!isStopped) {
            setCount(timers[activeTimerIndex].endVal)

            if (timers[activeTimerIndex].title === "XY" || timers[activeTimerIndex].title === "Tabata") {
                setRound(timers[activeTimerIndex].roundEndVal)
            }
            if (timers[activeTimerIndex].title === "Tabata") {
                setInterv(timers[activeTimerIndex].restTimeEndVal)
            }

            setRemainingTime(workoutRunningTime.current - getTotalFastForwardTime(timers, activeTimerIndex))
        }
    }

    return (
        <div className="workout-container">

            {timers.length > 0 && (
                <div className="workout-control-buttons">
                    <div>
                        {isStopped && <Button classes="tertiary" onClick={() => handleStart()}>Start</Button>}
                        {!isStopped && <Button classes="secondary" onClick={() => handlePause()}>{pauseLabel}</Button>}
                        <Button classes="secondary" disabled={isStopped} onClick={() => handleReset()}>Reset</Button>
                        <Button classes="secondary" disabled={isStopped} onClick={() => handleFastForward()}>Fast Forward</Button>
                    </div>
                </div>
            )}

            {timers.length > 0 && isStopped && !workoutIsFinished && (
                <div className="total-workout-time">
                    <h3>Total time</h3>
                    <TimePanel time={calculateWorkoutTime(timers)} />
                </div>
            )}

            {timers.length > 0 && (!isStopped || workoutIsFinished) && (
                <div className="remaining-workout-time">
                    <h3>Time remaining</h3>
                    <TimePanel time={workoutIsFinished ? 0 : remainingTime}/>
                </div>
            )}

            <div className="workout-items">
                {timers.length === 0 && (
                    <div className="no-workout">
                        <h2>You've not chosen your workout yet! 🏋🏼</h2>
                        <Link to="/add">
                            <Button classes="primary">Add timer</Button>
                        </Link>
                    </div>
                )}

                {timers.map((timerData, index) => (
                    <div className={"timer " + (index === activeTimerIndex && (!isStopped || workoutIsFinished) ? "active" : "")} key={`timer-${timerData.title}-${index}`}>
                        {
                            isStopped && <Button classes="delete extra-small round" key={`delete-${timerData.title}-${index}`} onClick={() => removeTimer(index)}>
                                <FontAwesomeIcon icon={faTrashCan} size="xs" />    
                            </Button>
                        }
                        <div className="timer-content" key={`timer-component-${timerData.title}-${index}`}>
                            <h3>{timerData.title}</h3>
                            <timerData.component {...timerData} isRunning={index === activeTimerIndex} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}