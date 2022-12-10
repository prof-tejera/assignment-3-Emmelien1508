import { useContext } from 'react'

import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { TimerContext } from '../../../context/TimerContext'
import { workoutIsDone } from '../../../utils/helpers'
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
        localStorage.setItem("timers", JSON.stringify(newTimers))
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
    
    const workoutIsFinished = workoutIsDone(props.timers)

    return (
        <div className='workout-items'>
            {props.timers.map((timer, index) => (
                <div className={`timer blurred-dark ${(index === currentTimerIndex && (!stopped || workoutIsFinished)) ? 'blurred-active' : ''}`} key={`timer-${timer.name}-${index}`}>
                    <Button classes='round secondary index'>
                        {index + 1}
                    </Button>
                    {stopped && (
                        <Button classes='round tertiary delete' key={`delete-${timer.name}-${index}`} onClick={() => removeTimer(index)}>
                            <FontAwesomeIcon icon={faTrashCan} size='sm' />    
                        </Button>
                    )}
                    <div className='timer-content' key={`timer-content-${timer.name}-${index}`}>
                        {getTimerComponent(timer, index, index === currentTimerIndex)}
                    </div>
                </div>
            ))}
        </div>
    )
}