import { useEffect, useContext, useRef } from "react";

import './XY.css'

import { TimerContext } from "../../../context/TimerContext";
import TimePanel from "../../molecules/time-panel/TimePanel";
import RoundPanel from "../../molecules/round-panel/RoundPanel";

export default function XY(props) {
    if (!props.isRunning || props.isCompleted) {
        return (
          <div className="main-panel">
                <TimePanel time={props.isCompleted ? props.endVal : props.startVal} />
                <RoundPanel round={props.isCompleted ? props.roundEndVal : props.roundStartVal} />
          </div>
        );
    }
    
    return (
        <InnerXY
            startVal={props.startVal}
            endVal={props.endVal}
            roundStartVal={props.roundStartVal}
            roundEndVal={props.roundEndVal}
        />
    )
}

function InnerXY(props) {
    const {
        count,
        setCount,
        round,
        setRound,
        isPaused,
        isStopped,
        remainingTime,
        setRemainingTime,
        dispatcher,
    } = useContext(TimerContext);
    const posRef = useRef();

    useEffect(() => {
        let time;
    
        if (!isPaused && !isStopped) {
            if (count > 0) {
                time = setTimeout(() => {
                setCount(count - 10);
                setRemainingTime(remainingTime - 10);
                }, 10);
            }
        
            if (round - 1 > 0 && count === 0) {
                setRound(round - 1);
                setCount(props.startVal);
            }
        
            if (round === 1 && count === 0) {
                dispatcher(posRef);
            }
        }
    
        return () => {
            if (time) {
                clearTimeout(time);
            }
        };
    }, [round, count, isPaused, isStopped]);
    
    return (
        <div className="xy" ref={posRef}>
            {
                !isStopped && !isPaused && (
                    <RoundPanel round={round} />
                )
            }
            <TimePanel time={count} />
        </div>
    );
}