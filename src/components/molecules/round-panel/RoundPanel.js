export default function RoundPanel(props) {
    const currentRound = props.running ? props.roundStartValue - props.currentRound + 1 : 1
    return (
        <div className="text-xs gray3">
            This is round {currentRound} / {props.roundStartValue}
        </div>
    )
}