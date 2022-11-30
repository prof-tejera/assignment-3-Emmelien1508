import { useEffect, useContext, useRef } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import RoundPanel from '../../molecules/round-panel/RoundPanel'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Tabata.css'


export default function Tabata(props) {
    console.log(props)
    if (!props.running || props.completed) {
        return (
            <div className='tabata'>
                <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
                <TimePanel time={props.completed ? props.restTimeEndValue : props.restTimeStartValue} />
                <RoundPanel 
                    round={props.completed ? props.roundEndValue : props.roundStartValue} 
                    roundEndValue={props.roundEndValue}
                />
            </div>
        )
    }
    
      return (
            <InnerTabata
                timeStartValue={props.timeStartValue}
                timeEndValue={props.timeEndValue}
                roundStartValue={props.roundStartValue}
                roundEndValue={props.roundEndValue}
                restTimeStartValue={props.restTimeStartValue}
                restTimeEndValue={props.restTimeEndValue}
            />
      )
}

function InnerTabata(props) {
    const {
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

    useEffect(() => {
        let restInterval = null
        let workInterval = null

        if (paused || stopped) {
            if (time) {
                clearTimeout(time)
            }

            if (restTime) {
                clearTimeout(restTime)
            }
        }

        if (!paused && !stopped) {
            if (time > 0) {
                workInterval = setInterval(() => {
                    setTime(time - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            }

            if (time === 0 && restTime > 0) {
                restInterval = setInterval(() => {
                    setRestTime(restTime - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            }

            if (round > 1 && time === 0 && restTime === 0) {
                setRound(round - 1)
                setTime(props.timeStartValue)
                setRestTime(props.restTimeStartValue)
            }
    
            if (round === 1 && time === 0 && restTime === 0) {
                dispatcher(ref)
            }

        } else {
            clearInterval(restInterval)
            clearInterval(workInterval)
        }

        return () => {
            clearInterval(restInterval)
            clearInterval(workInterval)
        }

    }, [round, time, restTime, paused, stopped])
    
    return (
        <div className='tabata' ref={ref}>
            <h4>Work 🏋🏼</h4>
            <TimePanel time={time} />
            <h4>Rest 🧘🏼</h4>
            <TimePanel time={restTime ? restTime : 0} />
            <RoundPanel round={round} roundEndValue={props.roundEndValue} />
        </div>
    )
}