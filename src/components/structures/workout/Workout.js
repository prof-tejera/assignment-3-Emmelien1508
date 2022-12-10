import { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { calculateWorkoutTime, workoutIsDone } from '../../../utils/helpers'
import { TimerContext } from '../../../context/TimerContext'
import Button from '../../atoms/button/Button'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Workout.css'
import WorkoutItems from '../../organisms/workout-items/WorkoutItems'


export default function Workout() {
    const {
        setTime, setRestTime, remainingTime, setRemainingTime,
        setRound, paused, setPaused, stopped, setStopped,
        setCurrentTimerIndex, setTimers
    } = useContext(TimerContext)

    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    const workoutRunningTime = useRef(0)

    // tijdens het runnen de current timer index + tijd + round + resttime elke 5-10 seconden saven
    // useEffect(() => {
    //     let interval = null
    //     if (remainingTime <= 0) {
    //         clearInterval(interval)
    //     } else {
    //         interval = setInterval(() => {
    //             console.log('Logs every 5 seconds if timers are running')
    //         }, 5000)
    //     }

    //     return () => clearInterval(interval)

    // }, [])

    useEffect(() => {
        if (stopped) {
            workoutRunningTime.current = calculateWorkoutTime(storedTimers)
            setRemainingTime(workoutRunningTime.current)
        }
    }, [stopped])

    function handleStart() {
        const newTimers = storedTimers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })

        setTimers(newTimers)
        setTime(storedTimers[0].timeStartValue)

        if (storedTimers[0].name === 'XY' || storedTimers[0].name === 'Tabata') {
            setRound(storedTimers[0].roundStartValue)
        }

        if (storedTimers[0].name === 'Tabata') {
            setRestTime(storedTimers[0].restTimeStartValue)
        }

        setCurrentTimerIndex(0)
        setStopped(false)
        setPaused(false)
    }

    function handlePause() {
        setPaused(!paused)
    }

    function handleReset() {
        const newTimers = storedTimers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })
        setTimers(newTimers)
        setStopped(true)
        setCurrentTimerIndex(999)
    }

    const workoutIsFinished = workoutIsDone(storedTimers)
    return (
        <div className='workout'>
            {storedTimers !== null && storedTimers.length > 0 && (
                <div className='workout-time-container blurred-dark'>    
                    {stopped && !workoutIsFinished && (
                        <div className='workout-time'>
                            <div className='text-center'>
                                <TimePanel 
                                    name={"total time"}
                                    index={0}
                                    size={200}
                                    duration={calculateWorkoutTime(storedTimers)}
                                    currentTime={calculateWorkoutTime(storedTimers)} 
                                />
                            </div>
                        </div>
                    )}

                    {(!stopped || workoutIsFinished) && (
                        <div className='workout-time'>
                            <div className='text-center'>
                                <TimePanel 
                                    name={"time remaining"}
                                    index={0}
                                    size={200}
                                    duration={workoutIsFinished ? 0 : remainingTime}
                                    currentTime={workoutIsFinished ? 0 : remainingTime}
                                />
                            </div>
                        </div>
                    )} 

                    <div className='workout-buttons'>
                        <Link to='/add'><Button classes='primary' onClick={() => handleReset()}>Add another timer</Button></Link>
                        {stopped && <Button classes='primary' onClick={() => handleStart()}>Start</Button>}
                        {!stopped && <Button classes={paused ? 'primary' : 'tertiary'} onClick={() => handlePause()}>{paused ? 'Resume' : 'Pause'}</Button>}
                        <Button classes='secondary' disabled={stopped} onClick={() => handleReset()}>Reset</Button>
                    </div>
                </div>
            )}

            <div className='workout-wrapper'>
                {(storedTimers === null || storedTimers.length === 0) && (
                    <div className='workout-empty blurred-dark'>
                        <p className='text-md'>You haven't chosen your workout yet! 🏋🏼</p>
                        <Link to='/add'>
                            <Button classes='primary'>Add timer</Button>
                        </Link>
                    </div>
                )}

                {storedTimers !== null && storedTimers.length > 0 && (
                    <WorkoutItems 
                        timers={storedTimers}
                        setTimers={setTimers}
                    />
                )}
            </div>
        </div>
    )
}