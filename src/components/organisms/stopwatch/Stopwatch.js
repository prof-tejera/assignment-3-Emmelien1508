import Timer from '../timer/Timer'


export default function Stopwatch(props) {
    return (
        <Timer 
            timerName='Stopwatch'
            running={props.running}
            completed={props.completed}
            timeStartValue={props.timeStartValue}
            timeEndValue={props.timeEndValue}
        />
    )
}