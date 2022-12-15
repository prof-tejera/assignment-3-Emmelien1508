import { useContext, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import RoundChooser from '../../molecules/round-chooser/RoundChooser'
import TimeChooser from '../../molecules/time-chooser/TimeChooser'
import Button from '../../atoms/button/Button'

import { TimerContext } from '../../../context/TimerContext'
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from '../../../utils/constants'
import { getInitialChooserData, getInitialTimerData, saveSearchParams, saveTimerData, setAddTimerConfiguration } from '../../../utils/helpers'

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

    const data = getInitialChooserData('', minutes, seconds, rounds, setMinutes, setSeconds, setRounds)
    const restData = getInitialChooserData('rest ', restMinutes, restSeconds, rounds, setRestMinutes, setRestSeconds, setRounds)

    const storedTimers = JSON.parse(localStorage.getItem('timers'))
    useEffect(() => {
        searchParams.set('timers', storedTimers ? JSON.stringify(storedTimers) : timers)
        setSearchParams(searchParams)
    }, [timers])

    useEffect(() => {
        if (searchParams.get('timers') && searchParams.get('timers') !== '') {
            const timers = JSON.parse(searchParams.get('timers'))
            console.log(timers)
            if (timers === null || timers.length === 0) { } else {
                setTimers(JSON.parse(searchParams.get('timers')))
            }
    
            if (searchParams.get('type') !== '' || searchParams.get('type') !== 'null') {
                setType(searchParams.get('type'))
                saveSearchParams(searchParams, setMinutes, setSeconds, setRestMinutes, setRestSeconds, setRounds)
            }
        }
    }, [])

    useEffect(() => {
        const timerData = timers ? JSON.stringify(timers) : JSON.stringify(storedTimers)
        const params = setAddTimerConfiguration(searchParams, type, minutes, seconds, rounds, restMinutes, restSeconds, timerData)
        setSearchParams(params)
    }, [type, minutes, seconds, restMinutes, restSeconds, rounds])

    function addTimer() {
        let data = getInitialTimerData(type, timers.length + 1, minutes, seconds)
        data = saveTimerData(data, minutes, seconds, restMinutes, restSeconds, rounds)
        const newTimers = [...timers, data]
        
        setTimers(newTimers)
        resetTimerData()

        searchParams.set('timers', newTimers ? JSON.stringify(newTimers) : JSON.stringify(storedTimers))
        setSearchParams(searchParams)
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
        <div className='add-timer'>
            
            <div className='add-timer-container blurred'>
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

            {storedTimers && storedTimers.length > 0 && (
                <div className='timer-placeholder-summary blurred'>
                    <div className='timer-placeholders'>
                        {storedTimers && storedTimers.map((timer, index) => (
                            <div className='timer-placeholder blurred' key={index}>
                                <p className='text-xs'>{index + 1}. {timer.name}</p>
                            </div>
                        ))}
                    </div>
                    <Link to='/'><Button classes='secondary'>Go to workout</Button></Link>
                </div>
            )}

        </div>
    )
}