import { useContext, useEffect, useRef } from "react"
import { Link } from "react-router-dom"

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { calculateWorkoutTime, getTotalFastForwardTime, workoutIsDone } from "../../../utils/helpers"
import { TimerContext } from "../../../context/TimerContext"
import Button from "../../atoms/button/Button"
import TimePanel from "../../molecules/time-panel/TimePanel"

import './Workout.css'


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
        setTime(timers[0].startTimeValue)

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
            setTime(timers[currentTimerIndex].timeEndValue)

            if (timers[currentTimerIndex].name === "XY" || timers[currentTimerIndex].name === "Tabata") {
                setRound(timers[currentTimerIndex].roundEndValue)
            }
            if (timers[currentTimerIndex].name === "Tabata") {
                setRestTime(timers[currentTimerIndex].restTimeEndValue)
            }

            setRemainingTime(workoutRunningTime.current - getTotalFastForwardTime(timers, currentTimerIndex))
        }
    }
    console.log(`current timer index: ${currentTimerIndex}`)

    const workoutIsFinished = workoutIsDone(timers)

    console.log(`stopped: ${stopped}`)
    console.log(`workout finished: ${workoutIsFinished}`)
    console.log(!stopped || workoutIsFinished)
    return (
        <div className="workout">
            {timers.length > 0 && stopped && !workoutIsFinished && (
                <div className="workout-time">
                    <div className="text-lg">
                        <p>Total time</p>
                        <TimePanel time={calculateWorkoutTime(timers)} />
                    </div>
                </div>
            )}

            {timers.length > 0 && (!stopped || workoutIsFinished) && (
                <div className="workout-time">
                    <div className="text-lg">
                        <p>Time remaining</p>
                        <TimePanel time={workoutIsFinished ? 0 : remainingTime}/>
                    </div>
                </div>
            )}

            {timers.length > 0 && (
                <div className="workout-buttons">
                    <Link to='/add'><Button classes="primary" onClick={() => handleReset()}>Add another timer</Button></Link>
                    {stopped && <Button classes="primary" onClick={() => handleStart()}>Start</Button>}
                    {!stopped && <Button classes="primary" onClick={() => handlePause()}>{paused ? "Resume" : "Pause"}</Button>}
                    <Button classes="secondary" disabled={stopped} onClick={() => handleReset()}>Reset</Button>
                    <Button classes="secondary" disabled={stopped} onClick={() => handleFastForward()}>Fast Forward</Button>
                </div>
            )}

            <div className="workout-wrapper">
                {timers.length === 0 && (
                    <div className="workout-empty">
                        <h2>You've not chosen your workout yet! 🏋🏼</h2>
                        <Link to="/add">
                            <Button classes="primary">Add timer</Button>
                        </Link>
                    </div>
                )}

                <div className="workout-items">
                    {timers.map((timer, index) => (
                        <div className={`timer ${(index === currentTimerIndex && (!stopped || workoutIsFinished)) ? 'active' : ''}`} key={`timer-${timer.name}-${index}`}>
                            <Button classes="round secondary index">
                                {index}
                            </Button>
                            {stopped && (
                                <Button classes="round tertiary delete" key={`delete-${timer.name}-${index}`} onClick={() => removeTimer(index)}>
                                    <FontAwesomeIcon icon={faTrashCan} size="sm" />    
                                </Button>
                            )}
                            <div className="timer-content" key={`timer-content-${timer.name}-${index}`}>
                                <p>{timer.name}</p>
                                <p className="text-xs gray3">{timer.subtitle}</p>
                                <timer.component {...timer} running={index === currentTimerIndex} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}