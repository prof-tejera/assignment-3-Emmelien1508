import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../atoms/button/Button";
import RoundChooser from "../../molecules/round-chooser/RoundChooser";
import TimeChooser from "../../molecules/time-chooser/TimeChooser";

import Countdown from '../countdown/Countdown'
import Stopwatch from '../stopwatch/Stopwatch'
import Tabata from '../tabata/Tabata'
import XY from '../xy/XY'

import { getMiliseconds } from "../../../utils/helpers";
import { TimerContext } from "../../../context/TimerContext";

import './AddTimer.css'

export default function AddTimer() {
    const navigate = useNavigate();
    const { timers, setTimers } = useContext(TimerContext);
  
    const [type, setType] = useState("");
    const [rounds, setRounds] = useState(1);
    const [intervalMinutes, setIntervalMinutes] = useState(0);
    const [intervalSeconds, setIntervalSeconds] = useState(30);
    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(0);

    const data = {
        minutesLabel: "Minutes",
        secondsLabel: "Seconds",
        minutes,
        seconds,
        setMinutes,
        setSeconds,
    }

    const intervalData = {
        minutesLabel: "Rest minutes",
        secondsLabel: "Rest seconds",
        minutes: intervalMinutes,
        seconds: intervalSeconds,
        setMinutes: setIntervalMinutes,
        setSeconds: setIntervalSeconds,
    }

    function addTimer() {
        let timerData = {
            title: "",
            component: "",
            startVal: "",
            endVal: "",
            roundStartVal: "",
            roundEndVal: "",
            intervalStartVal: "",
            intervalEndVal: "",
            isRunning: false,
            isCompleted: false,
        }
        timerData.title = type

        if (type === 'Stopwatch') {
            timerData.component = Stopwatch;
            timerData.startVal = 0;
            timerData.endVal = getMiliseconds(minutes, seconds);
            timerData.timerSecs = timerData.endVal;
        } else if (type === 'Countdown') {
            timerData.component = Countdown;
            timerData.startVal = getMiliseconds(minutes, seconds);
            timerData.endVal = 0;
            timerData.timerSecs = timerData.startVal;
        } else if (type === 'XY') {
            timerData.component = XY;
            timerData.startVal = getMiliseconds(minutes, seconds);
            timerData.endVal = 0;
            timerData.roundStartVal = rounds;
            timerData.roundEndVal = 1;
            timerData.timerSecs = timerData.startVal * timerData.roundStartVal;
        } else {
            timerData.component = Tabata;
            timerData.startVal = getMiliseconds(minutes, seconds);
            timerData.endVal = 0;
            timerData.intervalStartVal = getMiliseconds(intervalMinutes, intervalSeconds);
            timerData.intervalEndVal = 0;
            timerData.roundStartVal = rounds;
            timerData.roundEndVal = 1;
            timerData.timerSecs = (timerData.startVal + timerData.intervalStartVal) * timerData.roundStartVal;
        }

        const newTimer = [...timers, timerData];
        setTimers(newTimer);
    
        // reset values
        setType("")
        setRounds(1)
        setIntervalMinutes(0)
        setIntervalSeconds(30)
        setMinutes(1)
        setSeconds(0)
    }

    let timerChooser 
    if (type === "Stopwatch" || type === "Countdown") {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
            </div>
        )
    } else if (type === "XY") {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
                <RoundChooser rounds={rounds} setRounds={setRounds}/>
            </div>
        )
    } else {
        timerChooser = (
            <div>
                <TimeChooser {...data} />
                <TimeChooser {...intervalData} />
                <RoundChooser rounds={rounds} setRounds={setRounds}/>
            </div>
        )
    }

    return (
        <div className="add-timer-container">
            <div className="add-timer-header">
                <h2>Choose a timer for your workout</h2>
                <p className="text-xs">Which timer do you want?</p>
                <select value={type} onChange={(e) => {setType(e.target.value)}}>
                    <option value="">--</option>
                    <option value="Countdown">Countdown</option>
                    <option value="Stopwatch">Stopwatch</option>
                    <option value="XY">XY</option>
                    <option value="Tabata">Tabata</option>
                </select>
            </div>

            {type && (
                <div className="add-timer-body">
                    <div className="timer-chooser">{timerChooser}</div>
                    <Button classes="tertiary" onClick={addTimer}>Add Timer</Button>
                </div>
            )}

            <div className="add-timer-buttons">
                <Button classes="primary" onClick={() => navigate("/")}>To workout</Button>
                <Button classes="secondary" onClick={() => navigate("/docs")}>To docs</Button>
            </div>
        </div>
    )
}