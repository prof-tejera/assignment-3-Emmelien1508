import Timer from '../timer/Timer'


export default function XY(props) {
    return (
        <Timer 
            timerName='XY'
            running={props.running}
            completed={props.completed}
            timeStartValue={props.timeStartValue}
            timeEndValue={props.timeEndValue}
            roundStartValue={props.roundStartValue}
            roundEndValue={props.roundEndValue}
        />
    )
}