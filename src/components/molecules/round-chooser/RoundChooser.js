import PropTypes from 'prop-types'

import Button from '../../atoms/button/Button'

import './RoundChooser.css'


export default function RoundChooser({rounds, setRounds}) {
    function handleRoundDecrement() {
        if (rounds > 1) {
            setRounds(rounds - 1)
        }
    }

    function handleRoundIncrement() {
        setRounds(rounds + 1)
    }


    return (
        <div className='round-chooser'>
            <p>rounds</p>
            <div className='chooser-buttons'>
                <Button onClick={handleRoundDecrement}>-</Button>
                <p className='chooser-amount'>{rounds}</p>
                <Button onClick={handleRoundIncrement}>+</Button>
            </div>
        </div>
    )
}

RoundChooser.propTypes = {
    rounds: PropTypes.number,
    setRounds: PropTypes.func
}