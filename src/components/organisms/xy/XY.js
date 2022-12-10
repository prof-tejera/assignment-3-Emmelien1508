import { useEffect, useContext } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './XY.css'


export default function XY(props) {

    if (!props.running || props.completed) {
        return (
          <div className='xy'>
                <TimePanel 
                    name={props.name}
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
        <InnerXY
            name={props.name}
            subtitle={props.subtitle}
            index={props.index}
            timeStartValue={props.timeStartValue}
            roundStartValue={props.roundStartValue}
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
                name={props.name}
                subtitle={props.subtitle}
                index={props.index}
                currentTime={time} 
                currentRound={round}
                roundStartValue={props.roundStartValue}
                animated={!paused && !stopped && time > 0}
                duration={props.timeStartValue} 
            />
        </div>
    )
}