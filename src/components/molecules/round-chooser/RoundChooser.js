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
        <div className='round-chooser'>
            <p>rounds</p>
            <div className='chooser-buttons'>
                <Button onClick={handleRoundDecrement}>-</Button>
                <p className='chooser-amount'>{props.rounds}</p>
                <Button onClick={handleRoundIncrement}>+</Button>
            </div>
        </div>
    )
}