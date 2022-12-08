import { useContext, useState } from 'react'

import { getSeconds } from '../../../utils/helpers'
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from '../../../utils/constants'
import { TimerContext } from '../../../context/TimerContext'
import Button from '../../atoms/button/Button'
import RoundChooser from '../../molecules/round-chooser/RoundChooser'
import TimeChooser from '../../molecules/time-chooser/TimeChooser'
import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'
import Tabata from '../../organisms/tabata/Tabata'
import XY from '../../organisms/xy/XY'

import './AddTimer.css'


export default function AddTimer() {
    const { timers, setTimers } = useContext(TimerContext)
  
    const [type, setType] = useState('')
    const [rounds, setRounds] = useState(initialRounds)
    const [restMinutes, setRestMinutes] = useState(initialMinutes)
    const [restSeconds, setRestSeconds] = useState(initialSeconds)
    const [minutes, setMinutes] = useState(initialRestMinutes)
    const [seconds, setSeconds] = useState(initialRestSeconds)

    const data = {
        minutesLabel: 'minutes',
        secondsLabel: 'seconds',
        minutes: minutes,
        seconds: seconds,
        setMinutes: setMinutes,
        setSeconds: setSeconds,
    }

    const restData = {
        minutesLabel: 'rest minutes',
        secondsLabel: 'rest seconds',
        minutes: restMinutes,
        seconds: restSeconds,
        setMinutes: setRestMinutes,
        setSeconds: setRestSeconds,
    }

    function addTimer() {
        let timerData = {
            name: '',
            component: null,
            running: false,
            completed: false,
            timeStartValue: getSeconds(minutes, seconds),
            timeEndValue: 0,
            roundStartValue: rounds,
            roundEndValue: 1,
            restTimeStartValue: getSeconds(restMinutes, restSeconds),
            restTimeEndValue: 0,
        }
        timerData.name = type

        if (type === 'Stopwatch') {
            const min = ("0" + minutes).slice(-2)
            const sec = ("0" + seconds).slice(-2)
            timerData.component = Stopwatch
            timerData.timeStartValue = 0
            timerData.timeEndValue = getSeconds(minutes, seconds)
            timerData.timerMiliseconds = timerData.timeEndValue
            timerData.subtitle = `count up to ${min}:${sec}`
        } else if (type === 'Countdown') {
            const min = ("0" + minutes).slice(-2)
            const sec = ("0" + seconds).slice(-2)
            timerData.component = Countdown
            timerData.timerMiliseconds = timerData.timeStartValue
            timerData.subtitle = `count down from ${min}:${sec}`
        } else if (type === 'XY') {
            const min = ("0" + minutes).slice(-2)
            const sec = ("0" + seconds).slice(-2)
            timerData.component = XY
            timerData.timerMiliseconds = timerData.timeStartValue * timerData.roundStartValue
            timerData.subtitle = `count down from ${min}:${sec}`
        } else {
            const min = ("0" + minutes).slice(-2)
            const sec = ("0" + seconds).slice(-2)
            const restMin = ("0" + restMinutes).slice(-2)
            const restSec = ("0" + restSeconds).slice(-2)
            timerData.component = Tabata
            timerData.timerMiliseconds = (timerData.timeStartValue + timerData.restTimeStartValue) * timerData.roundStartValue
            timerData.subtitle = `work for ${min}:${sec} & rest for ${restMin}:${restSec}`
        }

        // console.log(timerData)
        // new URLSearchParams(timerData).toString()

        const newTimers = [...timers, timerData]
        setTimers(newTimers)
        resetTimerData()
    }

    function resetTimerData() {
        setType('')
        setRounds(initialRounds)
        setRestMinutes(initialRestMinutes)
        setRestSeconds(initialRestSeconds)
        setMinutes(initialMinutes)
        setSeconds(initialSeconds)
    }

    function handleChooseTimer(event) {
        setType(event.target.textContent)
    }

    return (
        <div className='add-timer blurred'>
            <div className='timer-placeholders'>
                {timers.map((timer, index) => (
                    <div className='timer-placeholder' key={index}>
                        <p className='text-xs'>{index + 1}. {timer.name}</p>
                    </div>
                ))}
            </div>
            <p className='text-lg text-center'>Choose a timer for your workout</p>
            <div className='add-timer-wrapper'>
                <div className='timer-options'>
                    <Button classes={`secondary ${type === 'Stopwatch' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Stopwatch</Button>
                    <Button classes={`secondary ${type === 'Countdown' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Countdown</Button>
                    <Button classes={`secondary ${type === 'XY' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>XY</Button>
                    <Button classes={`secondary ${type === 'Tabata' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Tabata</Button>
                </div>
                <div className='timer-data'>
                    {(type === 'Stopwatch' || type === 'Countdown') && (
                        <div>
                            <TimeChooser {...data} />
                        </div>
                    )}

                    {type === 'XY' && (
                        <div>
                            <TimeChooser {...data} />
                            <RoundChooser rounds={rounds} setRounds={setRounds}/>
                        </div>
                    )}

                    {type === 'Tabata' && (
                        <div>
                            <TimeChooser {...data} />
                            <TimeChooser {...restData} />
                            <RoundChooser rounds={rounds} setRounds={setRounds}/>
                        </div>
                    )}
                </div>
            </div>

            {type && (
                <Button classes='primary' onClick={addTimer}>Save</Button>
            )}

        </div>
    )
}