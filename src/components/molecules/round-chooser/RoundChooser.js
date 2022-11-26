import Button from '../../atoms/button/Button'

import './RoundChooser.css'


export default function RoundChooser(props) {
    function handleRoundDecrement() {
        if (props.rounds > 1) {
            props.setRounds(props.rounds - 1)
        }
    }

    function handleRoundIncrement() {
        props.setRounds(props.rounds + 1)
    }


    return (
        <div className='round-chooser-buttons'>
            <p>Rounds:</p>
            <div className="round-chooser">
                <Button classes="extra-small" onClick={handleRoundDecrement}>-</Button>
                <p className='round-chooser-value'>{props.rounds}</p>
                <Button classes="extra-small" onClick={handleRoundIncrement}>+</Button>
            </div>
        </div>
    )
}