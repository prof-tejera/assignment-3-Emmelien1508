import PropTypes from 'prop-types'

import Button from '../../atoms/button/Button'

import Timer from '../timer/Timer'

import { calculateWorkoutTime } from '../../../utils/helpers'

import './WorkoutSummary.css'


export default function WorkoutSummary({timers, workoutIndex}) {
    function getTimerSummary(data) {
        data.size = 100
        data.compact = true
        return <Timer {...data} />
    }

    return (
        <div className='workout-summary blurred'>
            <div className='workout-information'>
                <p className='workout-number'>Workout #{workoutIndex + 1}</p>
                <p className='text-sm'>
                    Total duration: {calculateWorkoutTime(timers)} seconds
                </p>
            </div>
            <div className='workout-summary-container'>
                {timers.map((timer, index) => (
                    <div className={`timer-summary blurred`} key={`timer-${timer.name}-${workoutIndex}-${index}`}>
                        <Button classes='round secondary index'>
                            {index + 1}
                        </Button>
                        <div className='timer-summary-content' key={`timer-summary-content-${timer.name}-${workoutIndex}-${index}`}>
                            {getTimerSummary(timer)}
                        </div>
                    </div>
                ))} 
            </div>

        </div>
    )
}

WorkoutSummary.propTypes = {
    timers: PropTypes.array,
    workoutIndex: PropTypes.number
}