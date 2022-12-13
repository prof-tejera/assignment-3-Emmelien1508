import { useContext, useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { TimerContext } from "../../../context/TimerContext"
import { initialRounds, initialMinutes, initialSeconds, initialRestMinutes, initialRestSeconds } from "../../../utils/constants"
import { getInitialChooserData, setEditTimerConfiguration } from "../../../utils/helpers"
import Button from "../../atoms/button/Button"
import RoundChooser from "../../molecules/round-chooser/RoundChooser"
import TimeChooser from "../../molecules/time-chooser/TimeChooser"
import { ErrorBoundary } from 'react-error-boundary'

export default function EditTimer() {
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

        const timerData = storedTimers ? JSON.stringify(storedTimers) : JSON.stringify(timers)
        const query = setEditTimerConfiguration(searchParams, currentTimer.current, minutes, seconds, rounds, restMinutes, restSeconds, timerData)
        setSearchParams(query)
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

    function editTimer() {
        console.log("save timer config and add it to array of timers")
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
            <div className='add-timer blurred'>
                {timer && (<p className='text-lg text-center'>Edit {timer.name} ⏱️</p>)}
                <div className='add-timer-wrapper'>
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