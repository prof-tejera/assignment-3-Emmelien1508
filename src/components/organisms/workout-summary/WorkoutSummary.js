import Button from "../../atoms/button/Button";
import Countdown from "../countdown/Countdown";
import Stopwatch from "../stopwatch/Stopwatch";
import Tabata from "../tabata/Tabata";
import XY from "../xy/XY";

import './WorkoutSummary.css'


export default function WorkoutSummary(props) {
    function getTimerSummary(data, index) {
        if (data.name === 'Stopwatch') {
            return <Stopwatch size={100} compact={true} {...data} index={index} running={false}/>
        } else if (data.name === 'Countdown') {
            return <Countdown size={100} compact={true} {...data} index={index} running={false}/>
        } else if (data.name === 'XY') {
            return <XY size={100} compact={true} {...data} index={index} running={false}/>
        } else {
            return <Tabata size={100} compact={true} {...data} index={index} running={false}/>
        }
    }

    return (
        <div className="workout-summary blurred">
            <p className="workout-number">{`Workout #${props.workoutIndex + 1}`}</p>
            <div className="workout-summary-container">
                {props.timers.map((timer, index) => (
                    <div className={`timer-summary blurred`} key={`timer-${timer.name}-${props.workoutIndex}-${index}`}>
                        <Button classes='round secondary index'>
                            {index + 1}
                        </Button>
                        <div className="timer-summary-content" key={`timer-summary-content-${timer.name}-${props.workoutIndex}-${index}`}>
                            {getTimerSummary(timer, index)}
                        </div>
                    </div>
                ))} 
            </div>

        </div>
    )
}