import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

import { calculateWorkoutTime, workoutIsDone } from '../../../utils/helpers'
import { TimerContext } from '../../../context/TimerContext'
import Button from '../../atoms/button/Button'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Workout.css'
import WorkoutItems from '../../organisms/workout-items/WorkoutItems'


export default function Workout() {
    const {
        setTime, setRestTime, 
        remainingTime, setRemainingTime, setRound, 
        paused, setPaused, stopped, setStopped, 
        setCurrentTimerIndex, timers, setTimers, 
        showConfetti, setShowConfetti
    } = useContext(TimerContext)

    const [sidebarTop, setSidebarTop] = useState(undefined)
    const [searchParams, setSearchParams] = useSearchParams()
    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    const workoutHistory = JSON.parse(localStorage.getItem('history'))
    const workoutRunningTime = useRef(0)

    useEffect(() => {
        const timerContainer = document.querySelector('.workout-time-container')
        if (timerContainer) {
            setSidebarTop(timerContainer.getBoundingClientRect().top)
        }
    }, [])

    useEffect(() => {
        if (!sidebarTop) {
            return
        }
        window.addEventListener('scroll', makeSticky)
        return () => {
            window.removeEventListener('scroll', makeSticky)
        }
    }, [sidebarTop])
    
    function makeSticky() {
        const timerContainer = document.querySelector('.workout-time-container')
        const scrollTop = window.scrollY

        if (timerContainer) {
            if (scrollTop >= sidebarTop - 10) {
                timerContainer.classList.add('is-sticky')
            } else {
                timerContainer.classList.remove('is-sticky')
            }
        }
    }

    useEffect(() => {
        setShowConfetti(false)
    }, [])
    
    useEffect(() => {
        if (localStorage.getItem('timers') === 'null' && searchParams.get('timers')) {
            setTimers(JSON.parse(searchParams.get('timers')))
            localStorage.setItem('timers', searchParams.get('timers'))
        }
    }, [])

    useEffect(() => {
        if (stopped) {
            workoutRunningTime.current = calculateWorkoutTime(storedTimers)
            setRemainingTime(workoutRunningTime.current)
        }
    }, [stopped])

    useEffect(() => {
        setSearchParams({
            ...searchParams,
            timers: storedTimers ? JSON.stringify(storedTimers) : timers
        })
    }, [timers])

    function handleStart() {
        const newTimers = storedTimers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })

        newTimers[0].running = true
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

    const { width, height } = useWindowSize()
    const workoutIsFinished = workoutIsDone(storedTimers)
    return (
        <div className='workout'>
            {showConfetti && (
                <Confetti
                    width={width}
                    tweenDuration={2000}
                    height={height}
                    numberOfPieces={400}
                    colors={[
                        '#D90467', 
                        '#F2059F', 
                        '#9C5FD9', 
                        '#F28241', 
                        '#D3B3F2', 
                        '#9D00FF',
                        '#F23DB3',
                        '#F2AC29',
                        '#D94929',
                        '#F20F4B'
                    ]}
                />
            )}

            {(storedTimers === null || storedTimers.length === 0) && (
                <div className='workout-empty blurred'>
                    {workoutHistory !== null && workoutHistory.length > 0 && (
                        <p className='text-md'>Create your next workout! 🏋🏼</p>
                    )}
                    {(workoutHistory === null || workoutHistory.length === 0) && (
                        <p className='text-md'>You haven't chosen your workout yet! 🏋🏼</p>
                    )}
                    <Link to='/add'>
                        <Button classes='primary'>Add timer</Button>
                    </Link>
                </div>
            )}

            <div className='workout-container'>
                {storedTimers !== null && storedTimers.length > 0 && (
                    <div className='workout-time-container blurred'>    
                        {stopped && !workoutIsFinished && (
                            <div className='workout-time'>
                                <div className='text-center'>
                                    <TimePanel 
                                        name={'Total Time'}
                                        index={0}
                                        size={200}
                                        color={'#a7f745'}
                                        duration={calculateWorkoutTime(storedTimers)}
                                        currentTime={remainingTime} 
                                    />
                                </div>
                            </div>
                        )}

                        {(!stopped || workoutIsFinished) && (
                            <div className='workout-time'>
                                <div className='text-center'>
                                    <TimePanel 
                                        name={'Time remaining'}
                                        index={0}
                                        size={200}
                                        duration={workoutIsFinished ? 0 : remainingTime}
                                        currentTime={workoutIsFinished ? 0 : remainingTime}
                                    />
                                </div>
                            </div>
                        )} 

                        <div className='workout-buttons'>
                            <Link to='/add'><Button classes='primary'>Add another timer</Button></Link>
                            {stopped && <Button classes='primary' onClick={() => handleStart()}>Start</Button>}
                            {!stopped && <Button classes={paused ? 'primary' : 'tertiary'} onClick={() => handlePause()}>{paused ? 'Resume' : 'Pause'}</Button>}
                            <Button classes='secondary' disabled={stopped} onClick={() => handleReset()}>Reset</Button>
                        </div>
                    </div>
                )}

                <div className='workout-wrapper'>
                    {storedTimers !== null && storedTimers.length > 0 && (
                        <WorkoutItems 
                            timers={storedTimers}
                            setTimers={setTimers}
                        />
                    )}
                </div>
            </div>

        </div>
    )
}