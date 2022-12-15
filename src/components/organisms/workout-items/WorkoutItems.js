import { useContext } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'

import { faArrowDown, faArrowUp, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Button from '../../atoms/button/Button'

import { TimerContext } from '../../../context/TimerContext'
import { workoutIsDone, swapElements } from '../../../utils/helpers'

import './WorkoutItems.css'
import Timer from '../timer/Timer'


export default function WorkoutItems({timers, setTimers, handleReset}) {
    const { 
        stopped, currentTimerIndex
    } = useContext(TimerContext)
    
    const navigate = useNavigate()
    
    function removeTimer(timerIndex) {
        const newTimers = timers.filter((timer, index) => index !== timerIndex)
        setTimers(newTimers)
        localStorage.setItem('timers', JSON.stringify(newTimers))
    }

    function getTimerComponent(data, running) {
        return <Timer {...data} running={running} />
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
                <ErrorBoundary key={`${timer.index}-${index}`} FallbackComponent={ErrorFallback} onReset={() => handleReset()}>
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