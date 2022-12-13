import { useContext, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { getFormattedTime, getInitialChooserData, getInitialTimerData, getSeconds, setAddTimerConfiguration } from '../../../utils/helpers'
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
    const [searchParams, setSearchParams] = useSearchParams()
    const {timers, setTimers} = useContext(TimerContext)
  
    const [type, setType] = useState('')
    const [rounds, setRounds] = useState(initialRounds)
    const [restMinutes, setRestMinutes] = useState(initialRestMinutes)
    const [restSeconds, setRestSeconds] = useState(initialRestSeconds)
    const [minutes, setMinutes] = useState(initialMinutes)
    const [seconds, setSeconds] = useState(initialSeconds)

    const data = getInitialChooserData('', minutes, seconds, setMinutes, setSeconds)
    const restData = getInitialChooserData('rest ', restMinutes, restSeconds, setRestMinutes, setRestSeconds)

    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    useEffect(() => {
        setSearchParams({
            ...searchParams,
            timers: storedTimers ? JSON.stringify(storedTimers) : timers
        })
    }, [timers])

    useEffect(() => {
        const timers = JSON.parse(searchParams.get('timers'))
        if (timers === null || timers.length === 0) { } else {
            setTimers(JSON.parse(searchParams.get('timers')))
        }

        if (searchParams.get('type') !== '' || searchParams.get('type') !== 'null') {
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
        const timerData = timers ? JSON.stringify(timers) : JSON.stringify(storedTimers)
        const query = setAddTimerConfiguration(searchParams, type, minutes, seconds, rounds, restMinutes, restSeconds, timerData)
        setSearchParams(query)
    }, [type, minutes, seconds, restMinutes, restSeconds, rounds])

    function addTimer() {
        let data = getInitialTimerData(type, timers.length + 1, minutes, seconds)

        if (type === 'Stopwatch') {
            data.component = Stopwatch
            data.subtitle = `count up to ${getFormattedTime(minutes, seconds)}`
            data.timeEndValue = getSeconds(minutes, seconds) + 1
            data.timeStartValue = 1
            data.duration = data.timeEndValue - 1
        } else if (type === 'Countdown') {
            data.component = Countdown
            data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
            data.duration = data.timeStartValue
        } else if (type === 'XY') {
            data.component = XY
            data.currentRound = 0
            data.roundEndValue = 1
            data.roundStartValue = rounds
            data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
            data.duration = data.timeStartValue * data.roundStartValue
        } else {
            data.component = Tabata
            data.restTimeEndValue = 0
            data.restTimeStartValue = getSeconds(restMinutes, restSeconds)
            data.roundEndValue = 1
            data.roundStartValue = rounds
            data.subtitle = `work for ${getFormattedTime(minutes, seconds)} & rest for ${getFormattedTime(restMinutes, restSeconds)}`
            data.title = 'Work 🏋🏼'
            data.duration = (data.timeStartValue + data.restTimeStartValue) * data.roundStartValue
        }

        const newTimers = [...timers, data]
        setTimers(newTimers)
        resetTimerData()
        setSearchParams({
            timers: newTimers ? JSON.stringify(newTimers) : JSON.stringify(storedTimers)
        })
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
            <div className='timer-placeholder-summary'>
                <div className='timer-placeholders'>
                    {storedTimers && storedTimers.map((timer, index) => (
                        <div className='timer-placeholder blurred' key={index}>
                            <p className='text-xs'>{index + 1}. {timer.name}</p>
                        </div>
                    ))}
                </div>
                {storedTimers && storedTimers.length > 0 && (
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
                                <TimeChooser {...data} />
                            </div>
                        )}

                        {type === 'XY' && (
                            <div>
                                <TimeChooser {...data} />
                                <RoundChooser rounds={rounds} setRounds={setRounds} />
                            </div>
                        )}

                        {type === 'Tabata' && (
                            <div>
                                <TimeChooser {...data} />
                                <TimeChooser {...restData} />
                                <RoundChooser rounds={rounds} setRounds={setRounds} />
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