import { useContext, useEffect, useRef, useState } from "react"
import { createSearchParams, Link, useNavigate, useSearchParams } from "react-router-dom"
import { TimerContext } from "../../../context/TimerContext"
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from "../../../utils/constants"
import { getFormattedTime, getInitialChooserData, getSeconds, setEditTimerConfiguration } from "../../../utils/helpers"
import Button from "../../atoms/button/Button"
import RoundChooser from "../../molecules/round-chooser/RoundChooser"
import TimeChooser from "../../molecules/time-chooser/TimeChooser"
import { ErrorBoundary } from 'react-error-boundary'

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

    const data = getInitialChooserData('', minutes, seconds, setMinutes, setSeconds)
    const restData = getInitialChooserData('rest ', restMinutes, restSeconds, setRestMinutes, setRestSeconds)

    useEffect(() => {
        if (searchParams.get('index')) {
            currentTimer.current = storedTimers[parseInt(searchParams.get('index'))]
            setTimer(currentTimer.current)
        }

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
    }, [])

    useEffect(() => {
        const timerData = storedTimers ? JSON.stringify(storedTimers) : JSON.stringify(timers)
        const query = setEditTimerConfiguration(searchParams, currentTimer.current, minutes, seconds, rounds, restMinutes, restSeconds, timerData)
        setSearchParams(query)
    }, [minutes, seconds, restMinutes, restSeconds, rounds])

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

    function editTimer() {
        // const timrs = JSON.parse(searchParams.get('timers'))
        console.log("save timer config and add it to array of timers")
        if (currentTimer.current.name === 'Stopwatch') {
            currentTimer.current.timeEndValue = getSeconds(minutes, seconds) + 1
            currentTimer.current.duration = currentTimer.current.timeEndValue - 1
            data.subtitle = `count up to ${getFormattedTime(minutes, seconds)}`
        } else if (currentTimer.current.name === 'Countdown') {
            currentTimer.current.timeStartValue = getSeconds(minutes, seconds)
            currentTimer.current.duration = currentTimer.current.timeStartValue
            data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        } else if (currentTimer.current.name === 'XY') {
            currentTimer.current.roundStartValue = rounds
            currentTimer.current.timeStartValue = getSeconds(minutes, seconds)
            currentTimer.current.duration = currentTimer.current.timeStartValue * currentTimer.current.roundStartValue
            data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        } else {
            currentTimer.current.timeStartValue = getSeconds(minutes, seconds)
            currentTimer.current.restTimeStartValue = getSeconds(restMinutes, restSeconds)
            currentTimer.current.roundStartValue = rounds
            currentTimer.current.duration = (currentTimer.current.timeStartValue + currentTimer.current.restTimeStartValue) * currentTimer.current.roundStartValue
            data.subtitle = `work for ${getFormattedTime(minutes, seconds)} & rest for ${getFormattedTime(restMinutes, restSeconds)}`
        }

        console.log(timers)
        console.log(currentTimer.current)
        timers[currentTimer.current.index] = currentTimer.current
        navigate({
            pathname: '/',
            search: `?${createSearchParams({ timers: timers })}`
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