import Timer from '../timer/Timer'


export default function Countdown(props) {
    return (
        <Timer 
            timerName='Countdown' 
            running={props.running}
            completed={props.completed}
            timeEndValue={props.timeEndValue}
            timeStartValue={props.timeStartValue}
        />
    )
}