import { useContext, useEffect, useRef } from 'react'
import { TimerContext } from '../../../context/TimerContext'
import RoundPanel from '../../molecules/round-panel/RoundPanel'
import TimePanel from '../../molecules/time-panel/TimePanel'

export default function Timer(props) {
    
    if (!props.running || props.completed) {
        if (props.timerName === 'Tabata') {
            return (
                <div>
                    <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
                    <TimePanel time={props.completed ? props.restTimeEndValue : props.restTimeStartValue} />
                    <RoundPanel round={props.completed ? props.roundEndValue : props.roundStartValue} />
                </div>
            )
        } else if (props.timerName === 'XY') {
            return (
                <div>
                      <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
                      <RoundPanel round={props.completed ? props.roundEndValue : props.roundStartValue} />
                </div>
              )
        } else {
            return (
                <div>
                    <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
                </div>
            )
        }
    }

    if (props.timerName === 'Tabata') {
        return (
            <InnerTimer
                timeStartValue={props.timeStartValue}
                timeEndValue={props.timeEndValue}
                roundStartValue={props.roundStartValue}
                roundEndValue={props.roundEndValue}
                restTimeStartValue={props.restTimeStartValue}
                restTimeEndValue={props.restTimeEndValue}
            />
        )
    } else if (props.timerName === 'Countdown') {
        return (
            <InnerTimer
                timeStartValue={props.timeStartValue}
                timeEndValue={props.timeEndValue}
                roundStartValue={props.roundStartValue}
                roundEndValue={props.roundEndValue}
            />
        )
    } else {
        return (
            <InnerTimer 
                timeStartValue={props.timeStartValue} 
                timeEndValue={props.timeEndValue} 
            />
        )
    }

}

function InnerTimer(props) {
    const {
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

    useEffect(() => {
        let currentTime
    
        if (props.timerName === 'Tabata' && (paused || stopped)) {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    
        if (!paused && !stopped) {
            if (props.timerName === 'Stopwatch') {
                if (time < props.timeEndValue) {
                    increaseTime(currentTime)
                }
            } else {
                if (time > 0) {
                    decreaseTime(currentTime)
                }
            } 

            if (props.timerName === 'Tabata' ) {
                if (time === 0 && restTime > 0) {
                    decreaseTime(currentTime)
                }

                if (round > 1 && time === 0 && restTime === 0) {
                    setRound(round - 1)
                    setTime(props.timeStartValue)
                    setRestTime(props.restTimeStartValue)
                }

                if (round === 1 && time === 0 && restTime === 0) {
                    dispatcher(ref)
                }
            } else if (props.timerName === 'XY') {
                if (round > 1 && time === 0) {
                    setRound(round - 1)
                    setTime(props.timeStartValue)
                }
            
                if (round === 1 && time === 0) {
                    dispatcher(ref)
                }
            } else if (props.timerName === 'Countdown') {
                if (time === 0) {
                    dispatcher(ref)
                }
            } else if (props.timerName === 'Stopwatch') {
                if (time === props.timeEndValue) {
                    dispatcher(ref)
                }
            }
        }
    
        return () => {
            if (currentTime) {
                clearTimeout(currentTime)
            }
        }
    }, [time, restTime, paused, stopped])

    function decreaseTime(currentTime) {
        currentTime = setTimeout(() => {
            setTime(time - 10)
            setRemainingTime(remainingTime - 10)
        }, 10)
    }

    function increaseTime(currentTime) {
        currentTime = setTimeout(() => {
            setTime(time + 10)
            setRemainingTime(remainingTime - 10)
        }, 10)
    }

    return (
        <div ref={ref}>
            {props.timerName === 'Tabata' && (
                <>
                    <h4>Work 🏋🏼</h4>
                    <TimePanel time={time} />
                    <h4>Rest 🧘🏼</h4>
                    <TimePanel time={restTime ? restTime : 0} />
                    <RoundPanel round={round} />
                </>
            )}

            {props.timerName === 'XY' && (
                <>
                    {!stopped && !paused && <RoundPanel round={round} />}
                    <TimePanel time={time} />
                </>
            )}

            {(props.timerName === 'Countdown' || props.timerName === 'Stopwatch') && (
                <>
                    <TimePanel time={time} />
                </>
            )}
        </div>
    )
}