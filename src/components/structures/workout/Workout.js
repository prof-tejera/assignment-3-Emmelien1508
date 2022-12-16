import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Confetti from 'react-confetti'
import useWindowSize from 'react-use/lib/useWindowSize'

import WorkoutItems from '../../organisms/workout-items/WorkoutItems'
import TimePanel from '../../molecules/time-panel/TimePanel'
import Button from '../../atoms/button/Button'

import { TimerContext } from '../../../context/TimerContext'
import { MAX } from '../../../utils/constants'
import { calculateWorkoutRemainingTime, calculateWorkoutTime } from '../../../utils/helpers'

import './Workout.css'


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
    const [totalTime, setTotalTime] = useState(0)
    const workoutRemainingTime = useRef(0)
    const totalWorkoutTime = useRef(0)
    const initialRemainingTime = useRef(0)

    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    const workoutHistory = JSON.parse(localStorage.getItem('history'))

    useEffect(() => {
        if (searchParams.get('current-timer-index')) {
            setCurrentTimerIndex(parseInt(searchParams.get('current-timer-index')))
        } 

        if (searchParams.get('paused')) {
            setPaused(searchParams.get('paused') === 'true')
        }

        if (searchParams.get('rest-time')) {
            setRestTime(parseInt(searchParams.get('rest-time')))
        }

        if (searchParams.get('round')) {
            setRound(parseInt(searchParams.get('round')))
        } 

        if (searchParams.get('stopped')) {
            setStopped(searchParams.get('stopped') === 'true')
        }

        if (searchParams.get('time')) {
            setTime(parseInt(searchParams.get('time')))
        }

        if (searchParams.get('timers')) {
            setTimers(JSON.parse(searchParams.get('timers')))
            setTotalTime(calculateWorkoutTime(JSON.parse(searchParams.get('timers'))))
            initialRemainingTime.current = calculateWorkoutRemainingTime(JSON.parse(searchParams.get('timers')))
            console.log("initial remaining time " + initialRemainingTime.current)
            setRemainingTime(initialRemainingTime.current)
        }
    }, [])

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
        const storedTimers = JSON.parse(localStorage.getItem('timers'))
        const queryTimers = JSON.parse(searchParams.get('timers'))
        if (queryTimers && queryTimers.length > 0) {
            // case if timers are in search params
            setTimers(JSON.parse(searchParams.get('timers')))
            localStorage.setItem('timers', searchParams.get('timers'))
        } else if (storedTimers && storedTimers.length > 0) {
            // case if localstorage has timers in it
            setTimers(JSON.parse(localStorage.getItem('timers')))
        }
        totalWorkoutTime.current = calculateWorkoutTime(timers ? timers : storedTimers)
        setTotalTime(totalWorkoutTime.current)
    }, [])

    useEffect(() => {
        if (stopped || paused) {
            totalWorkoutTime.current = calculateWorkoutTime(timers)
            setTotalTime(totalWorkoutTime.current)
            workoutRemainingTime.current = calculateWorkoutRemainingTime(timers)
            setRemainingTime(workoutRemainingTime.current)
        }

        searchParams.set('remaining-time', `${remainingTime}`)
        setSearchParams(searchParams)
    }, [timers])

    function handleStart() {
        const newTimers = storedTimers.map((timer, index) => {
            return {...timer, running: false, completed: false}
        })

        newTimers[0].running = true
        setTimers(newTimers)

        setTime(storedTimers[0].initialTimeStartValue)

        if (storedTimers[0].name === 'XY' || storedTimers[0].name === 'Tabata') {
            setRound(storedTimers[0].initialRoundStartValue)
        }

        if (storedTimers[0].name === 'Tabata') {
            setRestTime(storedTimers[0].initialRestinitialTimeStartValue)
        }

        initialRemainingTime.current = calculateWorkoutTime(newTimers)
        setRemainingTime(initialRemainingTime.current)
        setCurrentTimerIndex(0)
        setStopped(false)
        setPaused(false)

        searchParams.set('stopped', 'false')
        searchParams.set('paused', 'false')
        setSearchParams(searchParams)
    }

    function handlePause() {
        setPaused(!paused)
        searchParams.set('paused', 'true')
        setSearchParams(searchParams)
    }

    function handleReset() {
        const newTimers = storedTimers.map((timer, index) => {
            return {...timer, running: false, completed: false, currentTime: 0}
        })
        setTimers(newTimers)
        setStopped(true)
        setCurrentTimerIndex(MAX)
        setRemainingTime(0)

        searchParams.set('timers', JSON.stringify(newTimers))
        searchParams.set('stopped', 'true')
        searchParams.set('current-timer-index', `${MAX}`)
        searchParams.set('remaining-time', `${calculateWorkoutTime(newTimers)}`)
        setSearchParams(searchParams)
    }

    const { width, height } = useWindowSize()
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
                        <div className='workout-time'>
                            <div className='text-center'>
                                {stopped && (
                                    <TimePanel
                                        animated={false}
                                        color={'#a7f745'}
                                        completed={false}
                                        currentTime={totalTime} 
                                        duration={totalTime}
                                        index={MAX}
                                        name={'Total time'}
                                        running={false}
                                        size={200}
                                    />
                                )}

                                {!stopped && (
                                    <TimePanel
                                        animated={!paused}
                                        color={'#a7f745'}
                                        completed={false}
                                        currentTime={remainingTime} 
                                        duration={totalTime}
                                        index={MAX}
                                        name={'Remaining time'}
                                        running={!paused}
                                        size={200}
                                    />
                                )}
                            </div>
                        </div>

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
                            handleReset={handleReset}
                        />
                    )}
                </div>
            </div>

        </div>
    )
}