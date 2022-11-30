import { useEffect, useContext, useRef } from 'react'

import { TimerContext } from '../../../context/TimerContext'
import RoundPanel from '../../molecules/round-panel/RoundPanel'
import TimePanel from '../../molecules/time-panel/TimePanel'

import './XY.css'


export default function XY(props) {
    if (!props.running || props.completed) {
        return (
          <div className='xy'>
                <TimePanel time={props.completed ? props.timeEndValue : props.timeStartValue} />
                <RoundPanel round={props.completed ? props.roundEndValue : props.roundStartValue} />
          </div>
        )
    }
    
    return (
        <InnerXY
            timeStartValue={props.timeStartValue}
            timeEndValue={props.timeEndValue}
            roundStartValue={props.roundStartValue}
            roundEndValue={props.roundEndValue}
        />
    )
}

function InnerXY(props) {
    const {
        time, setTime,
        remainingTime, setRemainingTime, round, setRound, 
        paused, stopped, dispatcher
    } = useContext(TimerContext)
    const ref = useRef()

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
                dispatcher(ref)
            }
        } else {
            clearInterval(interval)
        }

        return () => {
            clearInterval(interval)
        }

    }, [round, time, paused, stopped])
    
    return (
        <div className='xy' ref={ref}>
            {!stopped && !paused && <RoundPanel round={round} />}
            <TimePanel time={time} />
        </div>
    )
}