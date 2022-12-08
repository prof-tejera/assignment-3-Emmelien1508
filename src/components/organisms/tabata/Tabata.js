import { useEffect, useContext } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import RoundPanel from '../../molecules/round-panel/RoundPanel'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './Tabata.css'


export default function Tabata(props) {

    if (!props.running || props.completed) {
        return (
            <div className='tabata'>
                <TimePanel 
                    animated={props.running && !props.completed}
                    time={props.completed ? props.timeEndValue : props.timeStartValue} 
                />
                <TimePanel 
                    animated={props.running && !props.completed}
                    time={props.completed ? props.restTimeEndValue : props.restTimeStartValue} 
                />
                <RoundPanel 
                    currentRound={props.roundStartValue} 
                    roundStartValue={props.roundStartValue} 
                    running={props.running}
                />
            </div>
        )
    }
    
      return (
            <InnerTabata
                animated={props.running && !props.completed}
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
            <TimePanel 
                title={'Work 🏋🏼'}
                animated={time > 0}
                time={time} 
            />
            <TimePanel 
                title={'Rest 🧘🏼'}
                animated={time === 0 && restTime > 0}
                time={restTime ? restTime : 0} 
            />
            <RoundPanel  
                currentRound={round}
                roundStartValue={props.roundStartValue} 
                running={!stopped} 
            />
        </div>
    )
}