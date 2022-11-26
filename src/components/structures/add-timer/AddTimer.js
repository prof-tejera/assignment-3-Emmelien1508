import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'

import { getMiliseconds } from '../../../utils/helpers'
import { TimerContext } from '../../../context/TimerContext'
import Button from '../../atoms/button/Button'
import RoundChooser from '../../molecules/round-chooser/RoundChooser'
import TimeChooser from '../../molecules/time-chooser/TimeChooser'
import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'
import Tabata from '../../organisms/tabata/Tabata'
import XY from '../../organisms/xy/XY'

export default function AddTimer() {
    const navigate = useNavigate()
    const { timers, setTimers } = useContext(TimerContext)
  
    const [type, setType] = useState('')
    const [rounds, setRounds] = useState(1)
    const [restMinutes, setRestMinutes] = useState(0)
    const [restSeconds, setRestSeconds] = useState(30)
    const [minutes, setMinutes] = useState(1)
    const [seconds, setSeconds] = useState(0)

    const data = {
        minutesLabel: 'Minutes',
        secondsLabel: 'Seconds',
        minutes: minutes,
        seconds: seconds,
        setMinutes: setMinutes,
        setSeconds: setSeconds,
    }

    const restData = {
        minutesLabel: 'Rest minutes',
        secondsLabel: 'Rest seconds',
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
            startTimeValue: getMiliseconds(minutes, seconds),
            endTimeValue: 0,
            roundStartValue: rounds,
            roundEndValue: 1,
            restTimeStartValue: getMiliseconds(restMinutes, restSeconds),
            restTimeEndValue: 0,
        }
        timerData.name = type

        if (type === 'Stopwatch') {
            timerData.component = Stopwatch
            timerData.startTimeValue = 0
            timerData.endTimeValue = getMiliseconds(minutes, seconds)
            timerData.timerSeconds = timerData.endValue
        } else if (type === 'Countdown') {
            timerData.component = Countdown
            timerData.timerSeconds = timerData.startTimeValue
        } else if (type === 'XY') {
            timerData.component = XY
            timerData.timerSeconds = timerData.startTimeValue * timerData.roundStartValue
        } else {
            timerData.component = Tabata
            timerData.timerSeconds = (timerData.startTimeValue + timerData.restTimeStartValue) * timerData.roundStartValue
        }

        const newTimer = [...timers, timerData]
        setTimers(newTimer)
        resetTimerData()
    }

    function resetTimerData() {
        setType('')
        setRounds(1)
        setRestMinutes(0)
        setRestSeconds(30)
        setMinutes(1)
        setSeconds(0)
    }

    let timerChooser 
    if (type === 'Stopwatch' || type === 'Countdown') {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
            </div>
        )
    } else if (type === 'XY') {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
                <RoundChooser rounds={rounds} setRounds={setRounds}/>
            </div>
        )
    } else {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
                <TimeChooser {...restData} />
                <RoundChooser rounds={rounds} setRounds={setRounds}/>
            </div>
        )
    }

    return (
        <div>
            <div>
                <h2>Choose a timer for your workout</h2>
                <p className='text-xs'>Which timer do you want?</p>
                <select value={type} onChange={(e) => {setType(e.target.value)}}>
                    <option value='Countdown'>Countdown</option>
                    <option value='Stopwatch'>Stopwatch</option>
                    <option value='XY'>XY</option>
                    <option value='Tabata'>Tabata</option>
                </select>
            </div>

            {type && (
                <div>
                    <div>{timerChooser}</div>
                    <Button classes='tertiary' onClick={addTimer}>Add Timer</Button>
                </div>
            )}

            <div>
                <Button classes='primary' onClick={() => navigate('/')}>To workout</Button>
                <Button classes='secondary' onClick={() => navigate('/docs')}>To docs</Button>
            </div>
        </div>
    )
}