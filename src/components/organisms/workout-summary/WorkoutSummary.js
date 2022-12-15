import Countdown from '../countdown/Countdown'
import Stopwatch from '../stopwatch/Stopwatch'
import Tabata from '../tabata/Tabata'
import XY from '../xy/XY'
import Button from '../../atoms/button/Button'

import { calculateWorkoutTime } from '../../../utils/helpers'

import './WorkoutSummary.css'


export default function WorkoutSummary(props) {
    function getTimerSummary(data) {
        data.size = 100
        data.compact = true
        if (data.name === 'Stopwatch') {
            return <Stopwatch {...data} />
        } else if (data.name === 'Countdown') {
            return <Countdown {...data} />
        } else if (data.name === 'XY') {
            return <XY {...data} />
        } else {
            return <Tabata {...data} />
        }
    }

    return (
        <div className='workout-summary blurred'>
            <div className='workout-information'>
                <p className='workout-number'>Workout #{props.workoutIndex + 1}</p>
                <p className='text-sm'>
                    Total duration: {calculateWorkoutTime(props.timers)} seconds
                </p>
            </div>
            <div className='workout-summary-container'>
                {props.timers.map((timer, index) => (
                    <div className={`timer-summary blurred`} key={`timer-${timer.name}-${props.workoutIndex}-${index}`}>
                        <Button classes='round secondary index'>
                            {index + 1}
                        </Button>
                        <div className='timer-summary-content' key={`timer-summary-content-${timer.name}-${props.workoutIndex}-${index}`}>
                            {getTimerSummary(timer)}
                        </div>
                    </div>
                ))} 
            </div>

        </div>
    )
}