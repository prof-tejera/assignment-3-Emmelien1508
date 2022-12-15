import { useContext, useEffect } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { faArrowDown, faArrowUp, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'
import Tabata from '../../organisms/tabata/Tabata'
import XY from '../../organisms/xy/XY'
import Button from '../../atoms/button/Button'

import { TimerContext } from '../../../context/TimerContext'
import { workoutIsDone, swapElements } from '../../../utils/helpers'

import './WorkoutItems.css'


export default function WorkoutItems({timers, setTimers}) {
    const { 
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, setPaused, stopped, setStopped, 
        currentTimerIndex, setCurrentTimerIndex
    } = useContext(TimerContext)
    
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    
    function removeTimer(timerIndex) {
        const newTimers = timers.filter((timer, index) => index !== timerIndex)
        setTimers(newTimers)
        localStorage.setItem('timers', JSON.stringify(newTimers))
    }

    useEffect(() => {
        // we also actually have to change the stored timers themselves 
        // but more importantly, change the data that is stored in these timers,
        // ---> check the getrunningTimerData function for the fields

        // show the correct state based on the query params
        if (searchParams.get('current-timer-index')) {
            setCurrentTimerIndex(parseInt(searchParams.get('current-timer-index')))
        }

        if (searchParams.get('paused')) {
            setPaused(Boolean(searchParams.get('paused')))
        }

        if (searchParams.get('remaining-time')) {
            setRemainingTime(parseInt(searchParams.get('remaining-time')))
        }        
        
        if (searchParams.get('rest-time')) {
            setRestTime(parseInt(searchParams.get('rest-time')))
        }

        if (searchParams.get('round')) {
            setRound(parseInt(searchParams.get('round')))
        }

        if (searchParams.get('stopped')) {
            setStopped(Boolean(searchParams.get('stopped')))
        }

        if (searchParams.get('time')) {
            setTime(parseInt(searchParams.get('time')))
        }
    }, [])

    useEffect(() => {
        if (!stopped && remainingTime > 0) {
            setSearchParams({
                ...searchParams,
                'current-timer-index': currentTimerIndex,
                'paused': paused,
                'remaining-time': remainingTime,
                'rest-time': restTime,
                'round': round,
                'stopped': stopped,
                'time': time,
            })
        }
    }, [currentTimerIndex, time, restTime, remainingTime, round])

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
    
    function moveTimerDown(index) {
        if (index !== timers.length - 1) {
            const newTimers = swapElements(timers, index, index + 1)
            setTimers(newTimers)
            localStorage.setItem('timers', JSON.stringify(newTimers))
        }
    }

    function moveTimerUp(index) {
        if (index !== 0) {
            const newTimers = swapElements(timers, index - 1, index)
            setTimers(newTimers)
            localStorage.setItem('timers', JSON.stringify(newTimers))
        }
    }

    function editTimer(timer) {
        navigate({
            pathname: '/edit',
            search: `?${createSearchParams({...timer})}`
        })
    }

    function ErrorFallback({error, resetErrorBoundary}) {
        return (
          <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )
    }

    const workoutIsFinished = workoutIsDone(timers)

    return (
        <div className='workout-items'>
            {timers.map((timer, index) => (
                <ErrorBoundary key={`${timer.index}-${index}`} FallbackComponent={ErrorFallback} onReset={() => { }}>
                    <div className={`timer blurred-dark ${(index === currentTimerIndex && (!stopped || workoutIsFinished)) ? 'blurred-active' : ''}`} key={`timer-${timer.name}-${index}`}>
                        <Button classes='round primary index'>
                            {index + 1}
                        </Button>
                        {stopped && (
                            <div>
                                <Button classes='round primary edit' key={`edit-${timer.name}-${index}`} onClick={() => editTimer(timer)}>
                                    <FontAwesomeIcon icon={faPenToSquare} size="sm" />
                                </Button>
                                <Button classes='round secondary up' key={`up-${timer.name}-${index}`} onClick={() => moveTimerUp(index)}>
                                    <FontAwesomeIcon icon={faArrowUp} size='sm' />    
                                </Button>
                                <Button classes='round secondary down' key={`down-${timer.name}-${index}`} onClick={() => moveTimerDown(index)}>
                                    <FontAwesomeIcon icon={faArrowDown} size='sm' />    
                                </Button>
                                <Button classes='round tertiary delete' key={`delete-${timer.name}-${index}`} onClick={() => removeTimer(index)}>
                                    <FontAwesomeIcon icon={faTrashCan} size='sm' />    
                                </Button>
                            </div>
                        )}
                        <div className='timer-content' key={`timer-content-${timer.name}-${index}`}>
                            {getTimerComponent(timer, index === currentTimerIndex)}
                        </div>
                    </div>
                </ErrorBoundary>
            ))}
        </div>
    )
}