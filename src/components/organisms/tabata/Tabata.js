import { useEffect, useContext, useState } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Tabata.css'


export default function Tabata(props) {
    if (!props.running || props.completed) {
        return (
            <div className='tabata'>
                <TimePanel 
                    animated={props.running && !props.completed}
                    compact={props.compact ? props.compact : false}
                    currentRound={0}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                    index={props.index}
                    name={props.name}
                    roundStartValue={props.roundStartValue}
                    size={props.size} 
                    subtitle={props.subtitle}
                    title={'Work 🏋🏼'}
                />
            </div>
        )
    }
    
    return (
        <InnerTabata
            compact={props.compact ? props.compact : false}
            name={props.name}
            restTimeStartValue={props.restTimeStartValue}
            roundStartValue={props.roundStartValue}
            size={props.size} 
            subtitle={props.subtitle}
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
                    animated={!paused && !stopped && time > 0}
                    compact={props.compact ? props.compact : false}
                    currentRound={round}
                    currentTime={time}
                    duration={props.timeStartValue} 
                    index={props.index}
                    name={props.name}
                    roundStartValue={props.roundStartValue}
                    size={props.size} 
                    subtitle={props.subtitle}
                    title={'Work 🏋🏼'}
                />
            )}

            {!isWorkTime && (
                <TimePanel 
                    animated={!paused && !stopped && time === 0 && restTime > 0}
                    compact={props.compact ? props.compact : false}
                    currentRound={round}
                    currentTime={restTime ? restTime : 0} 
                    duration={props.restTimeStartValue} 
                    index={props.index}
                    name={props.name}
                    roundStartValue={props.roundStartValue}
                    size={props.size} 
                    subtitle={props.subtitle}
                    title={'Rest 🧘🏼'}
                />
            )}

            {!paused && !stopped && time === 0 && restTime === 0 && (
                <TimePanel 
                    animated={props.running && !props.completed}
                    compact={props.compact ? props.compact : false}
                    currentRound={0}
                    currentTime={props.completed ? props.timeEndValue : props.timeStartValue} 
                    duration={props.timeStartValue} 
                    index={props.index}
                    name={props.name}
                    roundStartValue={props.roundStartValue}
                    size={props.size} 
                    subtitle={props.subtitle}
                    title={'Work 🏋🏼'}
                />
            )}
        </div>
    )
}