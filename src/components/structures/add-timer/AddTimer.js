import { useContext, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getSeconds } from '../../../utils/helpers'
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from '../../../utils/constants'
import { TimerContext } from '../../../context/TimerContext'
import { useQueryState } from '../../../hooks/useQueryState'

import Button from '../../atoms/button/Button'
import RoundChooser from '../../molecules/round-chooser/RoundChooser'
import TimeChooser from '../../molecules/time-chooser/TimeChooser'
import Countdown from '../../organisms/countdown/Countdown'
import Stopwatch from '../../organisms/stopwatch/Stopwatch'
import Tabata from '../../organisms/tabata/Tabata'
import XY from '../../organisms/xy/XY'

import './AddTimer.css'


export default function AddTimer() {
    const [searchParams, setSearchParams] = useSearchParams()
    const {timers, setTimers} = useContext(TimerContext)
  
    const [type, setType] = useState('')
    const [rounds, setRounds] = useState(initialRounds)
    const [restMinutes, setRestMinutes] = useState(initialRestMinutes)
    const [restSeconds, setRestSeconds] = useState(initialRestSeconds)
    const [minutes, setMinutes] = useState(initialMinutes)
    const [seconds, setSeconds] = useState(initialSeconds)

    const [chosenType, setChosenType] = useQueryState("type")
    const [chosenRounds, setChosenRounds] = useQueryState("rounds")
    const [chosenMinutes, setChosenMinutes] = useQueryState("minutes")
    const [chosenSeconds, setChosenSeconds] = useQueryState("seconds")
    const [chosenRestMinutes, setChosenRestMinutes] = useQueryState("rest-minutes")
    const [chosenRestSeconds, setChosenRestSeconds] = useQueryState("rest-seconds")

    const chooseTime = {
        chosenMinutes: chosenMinutes,
        setChosenMinutes: setChosenMinutes,
        chosenSeconds: chosenSeconds,
        setChosenSeconds: setChosenSeconds,
    }

    const chooseRestTime = {
        chosenMinutes: chosenRestMinutes,
        setChosenMinutes: setChosenRestMinutes,
        chosenSeconds: chosenRestSeconds,
        setChosenSeconds: setChosenRestSeconds,
    }

    const chooseRounds = {
        chosenRounds: chosenRounds,
        setChosenRounds: setChosenRounds,
    }

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

    useEffect(() => {
        if (searchParams.get('type') !== '' || searchParams.get('type') !== null) {
            setType(searchParams.get('type'))

            if (searchParams.get('minutes')) {
                setMinutes(parseInt(searchParams.get('minutes')))
            }
    
            if (searchParams.get('seconds')) {
                setSeconds(parseInt(searchParams.get('seconds')))
            }
    
            if (searchParams.get('rest-minutes')) {
                setRestMinutes(parseInt(searchParams.get('rest-minutes')))
            }
    
            if (searchParams.get('rest-seconds')) {
                setRestSeconds(parseInt(searchParams.get('rest-seconds')))
            }
    
            if (searchParams.get('rounds')) {
                setRounds(parseInt(searchParams.get('rounds')))
            }
        }
    }, [])

    useEffect(() => {
        if (type !== '') {
            const q = {
                'type': chosenType ? chosenType : '',
                'minutes': chosenMinutes ? chosenMinutes : initialMinutes,
                'seconds': chosenSeconds ? chosenSeconds : initialSeconds,
            }
    
            if (chosenType === 'XY') {
                q['rounds'] = chosenRounds ? chosenRounds : initialRounds
            }
    
            if (chosenType === 'Tabata') {
                q['rounds'] = chosenRounds ? chosenRounds : initialRounds
                q['rest-minutes'] = chosenRestMinutes ? chosenRestMinutes : initialRestMinutes
                q['rest-seconds'] = chosenRestSeconds ? chosenRestSeconds : initialRestSeconds
            }
    
            setSearchParams(q)
        }
    }, [chosenType, chosenMinutes, chosenSeconds, chosenRestMinutes, chosenRestSeconds, chosenRounds])

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
            const min = ('0' + minutes).slice(-2)
            const sec = ('0' + seconds).slice(-2)
            timerData.component = Stopwatch
            timerData.timeStartValue = 0
            timerData.timeEndValue = getSeconds(minutes, seconds)
            timerData.timerMiliseconds = timerData.timeEndValue
            timerData.subtitle = `count up to ${min}:${sec}`
        } else if (type === 'Countdown') {
            const min = ('0' + minutes).slice(-2)
            const sec = ('0' + seconds).slice(-2)
            timerData.component = Countdown
            timerData.timerMiliseconds = timerData.timeStartValue
            timerData.subtitle = `count down from ${min}:${sec}`
        } else if (type === 'XY') {
            const min = ('0' + minutes).slice(-2)
            const sec = ('0' + seconds).slice(-2)
            timerData.component = XY
            timerData.timerMiliseconds = timerData.timeStartValue * timerData.roundStartValue
            timerData.subtitle = `count down from ${min}:${sec}`
        } else {
            const min = ('0' + minutes).slice(-2)
            const sec = ('0' + seconds).slice(-2)
            const restMin = ('0' + restMinutes).slice(-2)
            const restSec = ('0' + restSeconds).slice(-2)
            timerData.component = Tabata
            timerData.timerMiliseconds = (timerData.timeStartValue + timerData.restTimeStartValue) * timerData.roundStartValue
            timerData.subtitle = `work for ${min}:${sec} & rest for ${restMin}:${restSec}`
        }

        const newTimers = [...timers, timerData]
        setTimers(newTimers)
        resetTimerData()
        setSearchParams(new URLSearchParams({}))
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
        setChosenType(event.target.textContent)
    }

    return (
        <div className='add-timer blurred'>
            <div className='timer-placeholder-summary'>
                <div className='timer-placeholders'>
                    {timers.map((timer, index) => (
                        <div className='timer-placeholder blurred' key={index}>
                            <p className='text-xs'>{index + 1}. {timer.name}</p>
                        </div>
                    ))}
                </div>
                {timers.length > 0 && (
                    <Link to='/'><Button classes='primary'>Go to workout</Button></Link>
                )}
            </div>
            <p className='text-lg text-center'>Choose a timer for your workout</p>
            <div className='add-timer-wrapper'>
                <div className='timer-options'>
                    <Button classes={`secondary ${type === 'Stopwatch' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Stopwatch</Button>
                    <Button classes={`secondary ${type === 'Countdown' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Countdown</Button>
                    <Button classes={`secondary ${type === 'XY' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>XY</Button>
                    <Button classes={`secondary ${type === 'Tabata' ? 'active' : ''}`} onClick={(e) => handleChooseTimer(e)}>Tabata</Button>
                </div>
                {type && (
                    <div className='timer-data blurred'>
                        {(type === 'Stopwatch' || type === 'Countdown') && (
                            <div>
                                <TimeChooser {...data} {...chooseTime} chosenType={chosenType} />
                            </div>
                        )}

                        {type === 'XY' && (
                            <div>
                                <TimeChooser {...data} {...chooseTime} chosenType={chosenType} />
                                <RoundChooser rounds={rounds} setRounds={setRounds} {...chooseRounds}/>
                            </div>
                        )}

                        {type === 'Tabata' && (
                            <div>
                                <TimeChooser {...data} {...chooseTime} chosenType={chosenType} />
                                <TimeChooser {...restData} {...chooseRestTime} chosenType={chosenType} />
                                <RoundChooser rounds={rounds} setRounds={setRounds} {...chooseRounds}/>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {type && (
                <Button classes='primary' onClick={addTimer}>Save</Button>
            )}

        </div>
    )
}