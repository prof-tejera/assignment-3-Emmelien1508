import { useContext, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { calculateWorkoutTime, workoutIsDone } from '../../../utils/helpers'
import { TimerContext } from '../../../context/TimerContext'
import Button from '../../atoms/button/Button'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Workout.css'
import XY from '../../organisms/xy/XY'
import Tabata from '../../organisms/tabata/Tabata'
import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'


export default function Workout() {
    const {
        setTime, setRestTime, remainingTime, setRemainingTime,
        setRound, paused, setPaused, stopped, setStopped,
        currentTimerIndex, setCurrentTimerIndex, setTimers
    } = useContext(TimerContext)

    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    const workoutRunningTime = useRef(0)

    // tijdens het runnen de current timer index + tijd + round + resttime elke 5-10 seconden saven
    useEffect(() => {
        let interval = null
        if (remainingTime <= 0) {
            clearInterval(interval)
        } else {
            interval = setInterval(() => {
                console.log('Logs every 5 seconds if timers are running')
            }, 5000)
        }

        return () => clearInterval(interval)

    }, [])

    useEffect(() => {
        if (stopped) {
            workoutRunningTime.current = calculateWorkoutTime(storedTimers)
            setRemainingTime(workoutRunningTime.current)
        }
    }, [stopped])

    function removeTimer(timerIndex) {
        const newTimers = storedTimers.filter((timer, index) => index !== timerIndex)
        setTimers(newTimers)
        localStorage.setItem("timers", JSON.stringify(newTimers))
    }

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

    function getTimerComponent(data, running) {
        if (data.name === 'Stopwatch') {
            return <Stopwatch {...data} running={running}/>
        } else if (data.name === 'Countdown') {
            return <Countdown {...data} running={running}/>
        } else if (data.name === 'XY') {
            return <XY {...data} running={running}/>
        } else {
            return <Tabata {...data} running={running}/>
        }
    }

    const workoutIsFinished = workoutIsDone(storedTimers)
    return (
        <div className='workout'>
            {storedTimers.length > 0 && stopped && !workoutIsFinished && (
                <div className='workout-time blurred'>
                    <div className='text-center'>
                        <p>Total time</p>
                        <TimePanel classes="text-xl" time={calculateWorkoutTime(storedTimers)} />
                    </div>
                </div>
            )}

            {storedTimers.length > 0 && (!stopped || workoutIsFinished) && (
                <div className='workout-time blurred'>
                    <div className='text-center'>
                        <p>Time remaining</p>
                        <TimePanel classes="text-xl" time={workoutIsFinished ? 0 : remainingTime}/>
                    </div>
                </div>
            )}

            {storedTimers.length > 0 && (
                <div className='workout-buttons'>
                    <Link to='/add'><Button classes='primary' onClick={() => handleReset()}>Add another timer</Button></Link>
                    {stopped && <Button classes='primary' onClick={() => handleStart()}>Start</Button>}
                    {!stopped && <Button classes={paused ? 'primary' : 'tertiary'} onClick={() => handlePause()}>{paused ? 'Resume' : 'Pause'}</Button>}
                    <Button classes='secondary' disabled={stopped} onClick={() => handleReset()}>Reset</Button>
                </div>
            )}

            <div className='workout-wrapper'>
                {storedTimers.length === 0 && (
                    <div className='workout-empty blurred'>
                        <p className='text-md'>You haven't chosen your workout yet! 🏋🏼</p>
                        <Link to='/add'>
                            <Button classes='primary'>Add timer</Button>
                        </Link>
                    </div>
                )}

                <div className='workout-items'>
                    {storedTimers.map((timer, index) => (
                        <div className={`timer blurred ${(index === currentTimerIndex && (!stopped || workoutIsFinished)) ? 'blurred-active' : ''}`} key={`timer-${timer.name}-${index}`}>
                            <Button classes='round secondary index'>
                                {index + 1}
                            </Button>
                            {stopped && (
                                <Button classes='round tertiary delete' key={`delete-${timer.name}-${index}`} onClick={() => removeTimer(index)}>
                                    <FontAwesomeIcon icon={faTrashCan} size='sm' />    
                                </Button>
                            )}
                            <div className='timer-content' key={`timer-content-${timer.name}-${index}`}>
                                <p>{timer.name}</p>
                                <p className='text-xs gray3'>{timer.subtitle}</p>
                                {getTimerComponent(timer, index === currentTimerIndex)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}