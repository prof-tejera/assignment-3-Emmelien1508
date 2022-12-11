import { useContext, useEffect } from 'react'

import { faArrowDown, faArrowUp, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { TimerContext } from '../../../context/TimerContext'
import { workoutIsDone, swapElements } from '../../../utils/helpers'
import Button from '../../atoms/button/Button'
import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'
import Tabata from '../../organisms/tabata/Tabata'
import XY from '../../organisms/xy/XY'

import './WorkoutItems.css'
import { useSearchParams } from 'react-router-dom'

export default function WorkoutItems(props) {
    const { 
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, setPaused, stopped, setStopped, 
        currentTimerIndex, setCurrentTimerIndex
    } = useContext(TimerContext)
    
    const [searchParams, setSearchParams] = useSearchParams()
    function removeTimer(timerIndex) {
        const newTimers = props.timers.filter((timer, index) => index !== timerIndex)
        props.setTimers(newTimers)
        localStorage.setItem('timers', JSON.stringify(newTimers))
    }

    useEffect(() => {
        // we also actually have to change the stored timers themselves 
        // but more importantly, change the data that is stored in these timers,
        // ---> check the getrunningTimerData function for the fields
        console.log(searchParams)
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
            const q = {
                'current-timer-index': currentTimerIndex,
                'paused': paused,
                'remaining-time': remainingTime,
                'rest-time': restTime,
                'round': round,
                'stopped': stopped,
                'time': time,
            }
            console.log(q)
            setSearchParams(q)
        }
    }, [currentTimerIndex, time, restTime, remainingTime, round])

    function getTimerComponent(data, index, running) {
        if (data.name === 'Stopwatch') {
            return <Stopwatch {...data} index={index} running={running}/>
        } else if (data.name === 'Countdown') {
            return <Countdown {...data} index={index} running={running}/>
        } else if (data.name === 'XY') {
            return <XY {...data} index={index} running={running}/>
        } else {
            return <Tabata {...data} index={index} running={running}/>
        }
    }
    
    function moveTimerDown(index) {
        if (index !== props.timers.length - 1) {
            const newTimers = swapElements(props.timers, index, index + 1)
            props.setTimers(newTimers)
            localStorage.setItem('timers', JSON.stringify(newTimers))
        }
    }

    function moveTimerUp(index) {
        if (index !== 0) {
            const newTimers = swapElements(props.timers, index - 1, index)
            props.setTimers(newTimers)
            localStorage.setItem('timers', JSON.stringify(newTimers))
        }
    }

    const workoutIsFinished = workoutIsDone(props.timers)

    return (
        <div className='workout-items'>
            {props.timers.map((timer, index) => (
                <div className={`timer blurred-dark ${(index === currentTimerIndex && (!stopped || workoutIsFinished)) ? 'blurred-active' : ''}`} key={`timer-${timer.name}-${index}`}>
                    <Button classes='round primary index'>
                        {index + 1}
                    </Button>
                    {stopped && (
                        <div>
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
                        {getTimerComponent(timer, index, index === currentTimerIndex)}
                    </div>
                </div>
            ))}
        </div>
    )
}