import { useContext, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { calculateWorkoutTime, getTotalFastForwardTime, workoutIsDone } from "../../../utils/helpers"
import { TimerContext } from "../../../context/TimerContext"
import Button from "../../atoms/button/Button"
import TimePanel from "../../molecules/time-panel/TimePanel"

export default function Workout() {
    const {
        setTime, setRestTime, remainingTime, setRemainingTime,
        setRound, paused, setPaused, stopped, setStopped,
        currentTimerIndex, setCurrentTimerIndex, timers, setTimers
    } = useContext(TimerContext)

    const workoutRunningTime = useRef(0)

    useEffect(() => {
        if (stopped) {
            workoutRunningTime.current = calculateWorkoutTime(timers)
            setRemainingTime(workoutRunningTime.current)
        }
    }, [stopped])

    function removeTimer(timerIndex) {
        const newTimers = timers.filter((timer, index) => index !== timerIndex)
        setTimers(newTimers)
    }

    function handleStart() {
        const newTimers = timers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })
        setTimers(newTimers)
        setTime(timers[0].startValue)

        if (timers[0].name === "XY" || timers[0].name === "Tabata") {
            setRound(timers[0].roundStartValue)
        }
        if (timers[0].title === "Tabata") {
            setRestTime(timers[0].restTimeStartValue)
        }

        setCurrentTimerIndex(0)
        setStopped(false)
        setPaused(false)
    }

    function handlePause() {
        setPaused(!paused)
    }

    function handleReset() {
        const newTimers = timers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })
        setTimers(newTimers)
        setStopped(true)
        setCurrentTimerIndex(999)
    }

    function handleFastForward() {
        if (!stopped) {
            setTime(timers[currentTimerIndex].endValue)

            if (timers[currentTimerIndex].name === "XY" || timers[currentTimerIndex].name === "Tabata") {
                setRound(timers[currentTimerIndex].roundEndValue)
            }
            if (timers[currentTimerIndex].name === "Tabata") {
                setRestTime(timers[currentTimerIndex].restTimeEndValue)
            }

            setRemainingTime(workoutRunningTime.current - getTotalFastForwardTime(timers, currentTimerIndex))
        }
    }

    const workoutIsFinished = workoutIsDone(timers)

    return (
        <div className="workout">
            {timers.length > 0 && (
                <div>
                    <div>
                        {stopped && <Button classes="tertiary" onClick={() => handleStart()}>Start</Button>}
                        {!stopped && <Button classes="secondary" onClick={() => handlePause()}>{paused ? "Resume" : "Pause"}</Button>}
                        <Button classes="secondary" disabled={stopped} onClick={() => handleReset()}>Reset</Button>
                        <Button classes="secondary" disabled={stopped} onClick={() => handleFastForward()}>Fast Forward</Button>
                    </div>
                </div>
            )}

            {timers.length > 0 && stopped && !workoutIsFinished && (
                <div>
                    <h3>Total time</h3>
                    <TimePanel time={calculateWorkoutTime(timers)} />
                </div>
            )}

            {timers.length > 0 && (!stopped || workoutIsFinished) && (
                <div>
                    <h3>Time remaining</h3>
                    <TimePanel time={workoutIsFinished ? 0 : remainingTime}/>
                </div>
            )}

            <div className="workout-items">
                {timers.length === 0 && (
                    <div>
                        <h2>You've not chosen your workout yet! 🏋🏼</h2>
                        <Link to="/add">
                            <Button classes="primary">Add timer</Button>
                        </Link>
                    </div>
                )}

                {timers.map((timer, index) => (
                    <div className={"timer " + (index === currentTimerIndex && (!stopped || workoutIsFinished) ? "active" : "")} key={`timer-${timer.name}-${index}`}>
                        {stopped && (
                            <Button classes="delete extra-small round" key={`delete-${timer.name}-${index}`} onClick={() => removeTimer(index)}>
                                <FontAwesomeIcon icon={faTrashCan} size="xs" />    
                            </Button>
                        )}
                        <div className="timer-content" key={`timer-component-${timer.name}-${index}`}>
                            <h3>{timer.name}</h3>
                            <timer.component {...timer} running={index === currentTimerIndex} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}