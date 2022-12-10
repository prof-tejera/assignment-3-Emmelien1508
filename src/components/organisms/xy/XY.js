import { useEffect, useContext } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './XY.css'


export default function XY(props) {

    if (!props.running || props.completed) {
        return (
          <div className='xy'>
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
                />
          </div>
        )
    }
    
    return (
        <InnerXY
            compact={props.compact ? props.compact : false}
            index={props.index}
            name={props.name}
            roundStartValue={props.roundStartValue}
            size={props.size} 
            subtitle={props.subtitle}
            timeStartValue={props.timeStartValue}
        />
    )
}

function InnerXY(props) {
    const {
        time, setTime,
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, handleTimerCompleted
    } = useContext(TimerContext)

    useEffect(() => {
        let interval = null

        if (!paused && !stopped) {
            if (time > 0) {
                interval = setInterval(() => {
                    setTime(time - 1)
                    setRemainingTime(remainingTime - 1)
                }, 1000)
            }

            if (round - 1 > 0 && time === 0) {
                setRound(round - 1)
                setTime(props.timeStartValue)
            }
        
            if (round === 1 && time === 0) {
                handleTimerCompleted()
            }
        } else {
            clearInterval(interval)
        }

        return () => clearInterval(interval)

    }, [round, time, paused, stopped])
    
    return (
        <div className='xy'>
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
            />
        </div>
    )
}