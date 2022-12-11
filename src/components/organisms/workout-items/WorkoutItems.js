import { useContext } from 'react'

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

export default function WorkoutItems(props) {
    const { stopped, currentTimerIndex } = useContext(TimerContext)

    function removeTimer(timerIndex) {
        const newTimers = props.timers.filter((timer, index) => index !== timerIndex)
        props.setTimers(newTimers)
        localStorage.setItem('timers', JSON.stringify(newTimers))
    }

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
        if (index === props.timers.length - 1) {
            console.log('cannot move timer down')
        } else {
            const newTimers = swapElements(props.timers, index, index + 1)
            props.setTimers(newTimers)
            localStorage.setItem('timers', JSON.stringify(newTimers))
        }
    }

    function moveTimerUp(index) {
        if (index === 0) {
            console.log('cannot move timer up')
        } else {
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