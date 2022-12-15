import { useContext, useEffect, useRef, useState } from "react"
import { createSearchParams, Link, useNavigate, useSearchParams } from "react-router-dom"
import { ErrorBoundary } from 'react-error-boundary'

import RoundChooser from "../../molecules/round-chooser/RoundChooser"
import TimeChooser from "../../molecules/time-chooser/TimeChooser"
import Button from "../../atoms/button/Button"

import { TimerContext } from "../../../context/TimerContext"
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from "../../../utils/constants"
import { getInitialChooserData, getInitialTimerData, parseTime, saveSearchParams, saveTimerData, setEditTimerConfiguration } from "../../../utils/helpers"

import './EditTimer.css'


export default function EditTimer() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const {timers, setTimers} = useContext(TimerContext)
    const [timer, setTimer] = useState(null)

    const [rounds, setRounds] = useState(initialRounds)
    const [restMinutes, setRestMinutes] = useState(initialRestMinutes)
    const [restSeconds, setRestSeconds] = useState(initialRestSeconds)
    const [minutes, setMinutes] = useState(initialMinutes)
    const [seconds, setSeconds] = useState(initialSeconds)

    const currentTimer = useRef(timer)
    const storedTimers = JSON.parse(localStorage.getItem('timers'))

    const [data, setData] = useState(getInitialChooserData('', minutes, seconds, setMinutes, setSeconds))
    const [restData, setRestData] = useState(getInitialChooserData('rest ', restMinutes, restSeconds, setRestMinutes, setRestSeconds))
    
    useEffect(() => {
        if (searchParams.get('index')) {
            currentTimer.current = storedTimers[parseInt(searchParams.get('index'))]
            setTimer(currentTimer.current)
        }

        if (searchParams.get('name') && searchParams.get('timeEndValue') && searchParams.get('timeStartValue')) {
            const time = parseTime(searchParams.get('name'), searchParams.get('timeStartValue'), searchParams.get('timeEndValue'))
            setMinutes(time.minutes)
            setSeconds(time.seconds)
        }

        if (searchParams.get('roundStartValue')) {
            setRounds(parseInt(searchParams.get('roundStartValue')))
        }

        saveSearchParams(searchParams, setMinutes, setSeconds, setRestMinutes, setRestSeconds, setRounds)
    }, [])

    useEffect(() => {
        const storedTimers = JSON.parse(localStorage.getItem('timers'))
        const queryTimers = JSON.parse(searchParams.get('timers'))
        // case if localstorage has timers but searchparams is empty
        if (storedTimers && storedTimers.length > 0) {
            setTimers(JSON.parse(localStorage.getItem('timers')))
        } else if (queryTimers && queryTimers.length > 0) {
             // case if localstorage is empty but timers is in q params
            setTimers(JSON.parse(searchParams.get('timers')))
            localStorage.setItem('timers', searchParams.get('timers'))
        }
    }, [])

    useEffect(() => {
        let newData = getInitialChooserData('', minutes, seconds, rounds, setMinutes, setSeconds, setRounds)
        setData(newData)

        let newRestData = getInitialChooserData('rest ', restMinutes, restSeconds, rounds, setRestMinutes, setRestSeconds, setRounds)
        setRestData(newRestData)
        
        const timerData = timers ? JSON.stringify(timers) : JSON.stringify(storedTimers)
        const query = timer ? (
            setEditTimerConfiguration(searchParams, timer, newData.minutes, newData.seconds, newData.rounds, newRestData.minutes, newRestData.seconds, timerData)
        ) : (
            setEditTimerConfiguration(searchParams, currentTimer.current, newData.minutes, newData.seconds, newData.rounds, newRestData.minutes, newRestData.seconds, timerData)
        )
        setSearchParams({
            ...searchParams,
            ...query
        })
    }, [minutes, seconds, restMinutes, restSeconds, rounds])
    
    function editTimer() {
        let data = getInitialTimerData(timer ? timer.name : currentTimer.current.name, timers.length + 1, minutes, seconds)
        data.index = currentTimer.current.index
        data = saveTimerData(data, minutes, seconds, restMinutes, restSeconds, rounds)
        timers[data.index] = data

        navigate({
            pathname: '/',
            search: `?${createSearchParams({ timers: JSON.stringify(timers) })}`
        })
    }

    function ErrorFallback({error, resetErrorBoundary}) {
        return (
          <div role="alert">
                <p>Something went wrong:</p>
                <pre>{error.message}</pre>
                <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )
    }

    return (
        <ErrorBoundary  FallbackComponent={ErrorFallback} onReset={() => { }}>
            <div className='edit-timer blurred'>
                {timer && (<p className='text-lg text-center'>Edit {timer.name} ⏱️</p>)}
                <div className='edit-timer-wrapper'>
                    <div className='timer-data blurred'>
                        {timer && (
                            <div>
                                {(timer.name === 'Stopwatch' || timer.name === 'Countdown') && (
                                    <div>
                                        <TimeChooser {...data} />
                                    </div>
                                )}
            
                                {timer.name === 'XY' && (
                                    <div>
                                        <TimeChooser {...data} />
                                        <RoundChooser rounds={rounds} setRounds={setRounds} />
                                    </div>
                                )}
            
                                {timer.name === 'Tabata' && (
                                    <div>
                                        <TimeChooser {...data} />
                                        <TimeChooser {...restData} />
                                        <RoundChooser rounds={rounds} setRounds={setRounds} />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {timer && timer.name && (
                    <div>
                        <Button classes='primary' onClick={editTimer}>Save</Button>
                        <Link to='/'><Button classes='secondary'>Cancel</Button></Link>
                    </div>
                )}

            </div>
        </ErrorBoundary>
    )
}