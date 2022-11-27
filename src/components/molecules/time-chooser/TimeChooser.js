import Button from '../../atoms/button/Button'

import './TimeChooser.css'


export default function TimeChooser(props) {
    function handleMinIncrement() {
        if (props.minutes < 60) {
            props.setMinutes(props.minutes + 1)
        }
    }

    function handleMinDecrement() {
        if (props.minutes > 1) {
            props.setMinutes(props.minutes - 1)
        } else if (props.seconds > 0) {
            props.setMinutes(0)
        }
    }

    function handleSecIncrement() {
        if (props.seconds === 59) {
            props.setMinutes(props.minutes + 1)
            props.setSeconds(0)
        } else {
            props.setSeconds(props.seconds + 1)
        }
    }

    function handleSecDecrement() {
        if (props.seconds > 1) {
            props.setSeconds(props.seconds - 1)
        } else if (props.minutes > 0) {
            props.setSeconds(59)
            props.setMinutes(props.minutes - 1)
        }
    }

    return (
        <div className='time-chooser'>
            <div className='chooser minute-chooser'>
                <p>{props.minutesLabel}</p>
                <div className='chooser-buttons'>
                    <Button disabled={props.disabled} onClick={handleMinDecrement}>-</Button>
                    <p className='chooser-amount'>{props.minutes}</p>
                    <Button disabled={props.disabled} onClick={handleMinIncrement}>+</Button>
                </div>
            </div>
            
            <div className='chooser second-chooser'>
                <p>{props.secondsLabel}</p>
                <div className='chooser-buttons'>
                    <Button disabled={props.disabled} onClick={handleSecDecrement}>-</Button>
                    <p className='chooser-amount'>{props.seconds}</p>
                    <Button disabled={props.disabled} onClick={handleSecIncrement}>+</Button>
                </div>
            </div>
        </div>
    )
}