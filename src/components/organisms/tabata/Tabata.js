import Timer from '../timer/Timer'


export default function Tabata(props) {
    return (
        <Timer 
            timerName='Tabata'
            running={props.running}
            completed={props.completed}
            timeStartValue={props.timeStartValue}
            timeEndValue={props.timeEndValue}
            roundStartValue={props.roundStartValue}
            roundEndValue={props.roundEndValue}
            restTimeStartValue={props.restTimeStartValue}
            restTimeEndValue={props.restTimeEndValue}
        />
    )
}