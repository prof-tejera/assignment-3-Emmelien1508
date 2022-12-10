import { useEffect, useContext, useState } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Tabata.css'


export default function Tabata(props) {
    if (!props.running || props.completed) {
        return (
            <div className='tabata'>
                <TimePanel 
                    name={props.name}
                    title={'Work 🏋🏼'}
                    subtitle={props.subtitle}
                    index={props.index}
                    currentRound={0}
                    roundStartValue={props.roundStartValue}
                    animated={props.running && !props.completed}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                />
            </div>
        )
    }
    
    return (
        <InnerTabata
            name={props.name}
            subtitle={props.subtitle}
            restTimeStartValue={props.restTimeStartValue}
            roundStartValue={props.roundStartValue}
            timeStartValue={props.timeStartValue}
        />
    )
}

function InnerTabata(props) {
    const {
        time, setTime, restTime, setRestTime, 
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, handleTimerCompleted
    } = useContext(TimerContext)
    const [isWorkTime, setIsWorkTime] = useState(true)

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
                setIsWorkTime(true)
                workInterval = setInterval(() => {
                    setTime(time - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            } else if (time === 0 && restTime > 0) {
                setIsWorkTime(false)
                restInterval = setInterval(() => {
                    setRestTime(restTime - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            } else if (round > 1 && time === 0 && restTime === 0) {
                setIsWorkTime(true)
                setRound(round - 1)
                setTime(props.timeStartValue)
                setRestTime(props.restTimeStartValue)
            }
    
            if (round === 1 && time === 0 && restTime === 0) {
                handleTimerCompleted()
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
        <div className='tabata'>
            {isWorkTime && (
                <TimePanel 
                    name={props.name}
                    subtitle={props.subtitle}
                    index={props.index}
                    title={'Work 🏋🏼'}
                    currentRound={round}
                    roundStartValue={props.roundStartValue}
                    animated={!paused && !stopped && time > 0}
                    currentTime={time}
                    duration={props.timeStartValue} 
                />
            )}

            {!isWorkTime && (
                <TimePanel 
                    name={props.name}
                    subtitle={props.subtitle}
                    index={props.index}
                    title={'Rest 🧘🏼'}
                    currentRound={round}
                    roundStartValue={props.roundStartValue}
                    animated={!paused && !stopped && time === 0 && restTime > 0}
                    currentTime={restTime ? restTime : 0} 
                    duration={props.restTimeStartValue} 
                />
            )}

            {!paused && !stopped && time === 0 && restTime === 0 && (
                <TimePanel 
                    name={props.name}
                    title={'Work 🏋🏼'}
                    subtitle={props.subtitle}
                    index={props.index}
                    currentRound={0}
                    roundStartValue={props.roundStartValue}
                    animated={props.running && !props.completed}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                />
            )}
        </div>
    )
}