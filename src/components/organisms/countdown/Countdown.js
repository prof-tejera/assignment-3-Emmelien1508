import { useContext, useRef, useEffect} from "react";
import { TimerContext } from "../../../context/TimerContext";
import TimePanel from "../../molecules/time-panel/TimePanel";

export default function Countdown(props) {
    if (!props.isRunning || props.isCompleted) {
        return (
          <div className="main-panel">
                <TimePanel time={props.isCompleted ? props.endVal : props.startVal} />
          </div>
        )
    }

    return <InnerCountdown startVal={props.startVal} endVal={props.endVal} />
}

function InnerCountdown(props) {
    const {
        count,
        setCount,
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
        
            if (count === 0) {
                dispatcher(posRef);
            }
        }
    
        return () => {
            if (time) {
                clearTimeout(time);
            }
        };
    }, [count, isPaused, isStopped]);

    return (
        <div className="countdown" ref={posRef}>
            <TimePanel time={count} />
        </div>
    )
}