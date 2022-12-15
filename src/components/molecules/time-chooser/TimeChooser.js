import Button from '../../atoms/button/Button'

import './TimeChooser.css'


export default function TimeChooser({
    minutesLabel,
    secondsLabel,
    minutes,
    setMinutes,
    seconds,
    setSeconds
}) {
    function handleMinIncrement() {
        if (minutes < 60) {
            setMinutes(minutes + 1)
        }
    }

    function handleMinDecrement() {
        if (minutes > 1) {
            setMinutes(minutes - 1)
        } else if (seconds > 0) {
            setMinutes(0)
        }
    }

    function handleSecIncrement() {
        if (seconds === 59) {
            setMinutes(minutes + 1)
            setSeconds(0)
        } else {
            setSeconds(seconds + 1)
        }
    }

    function handleSecDecrement() {
        if (seconds >= 1) {
            setSeconds(seconds - 1)
        } else if (minutes === 1 && seconds === 0) {
            setSeconds(59)
            setMinutes(minutes - 1)
        }
    }

    return (
        <div className='time-chooser'>
            <div className='chooser minute-chooser'>
                <p>{minutesLabel}</p>
                <div className='chooser-buttons'>
                    <Button onClick={handleMinDecrement}>-</Button>
                    <p className='chooser-amount'>{minutes}</p>
                    <Button onClick={handleMinIncrement}>+</Button>
                </div>
            </div>
            
            <div className='chooser second-chooser'>
                <p>{secondsLabel}</p>
                <div className='chooser-buttons'>
                    <Button onClick={handleSecDecrement}>-</Button>
                    <p className='chooser-amount'>{seconds}</p>
                    <Button onClick={handleSecIncrement}>+</Button>
                </div>
            </div>
        </div>
    )
}