import Button from '../../atoms/button/Button'

import './TimeChooser.css'


export default function TimeChooser(props) {
    const titleClass = props.disabled ? "time-chooser-title disabled" : "time-chooser-title"
    const valClass = props.disabled ? "time-chooser-value disabled" : "time-chooser-value"

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
        <div className="timer-chooser-buttons">
            <div>
                <p className={titleClass}>{props.minutesLabel}:</p>
                <div className="time-chooser">
                    <Button classes="extra-small" disabled={props.disabled} onClick={handleMinDecrement}>-</Button>
                    <p className={valClass}>{props.minutes}</p>
                    <Button classes="extra-small" disabled={props.disabled} onClick={handleMinIncrement}>+</Button>
                </div>
            </div>
            
            <div>
                <p className={titleClass}>{props.secondsLabel}:</p>
                <div className="time-chooser">
                    <Button classes="extra-small" disabled={props.disabled} onClick={handleSecDecrement}>-</Button>
                    <p className={valClass}>{props.seconds}</p>
                    <Button classes="extra-small" disabled={props.disabled} onClick={handleSecIncrement}>+</Button>
                </div>
            </div>
        </div>
    )
}