import Countdown from "../components/organisms/countdown/Countdown"
import Stopwatch from "../components/organisms/stopwatch/Stopwatch"
import Tabata from "../components/organisms/tabata/Tabata"
import XY from "../components/organisms/xy/XY"

export function calculateWorkoutTime(timers) {
    if (timers === null) {
        return 0
    }
    
    let time = 0
    for (let i=0; i<timers.length; i++) {
        time += timers[i].duration
    }
    return time
}

export function workoutIsDone(timers) {
    if (timers === null) {
        return true
    }
    return !timers.some((timer) => timer.completed === false)
}

export function getSeconds(minutes, seconds) {
    return minutes * 60 + seconds
}

export function getTime(time) {
    const minutes =  Math.floor((time / 60) % 60)
    const seconds = Math.floor((time) % 60)
    return { minutes, seconds }
}

export function swapElements(array, index1, index2) {
    let temp = array[index1]
    array[index1] = array[index2]
    array[index2] = temp
    return array
}

export function getFormattedTime(minutes, seconds) {
    return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
}

export function getInitialTimerData(type, length, minutes, seconds) {
    return {
        animated: false,
        compact: false,
        completed: false,
        component: null,
        currentRound: null,
        currentTime: 0,
        duration: 0,
        index: length > 0 ? length - 1 : 0,
        name: type,
        restTimeEndValue: null,
        restTimeStartValue: null,
        roundEndValue: null,
        roundStartValue: null,
        running: false,
        size: 240,
        subtitle: '',
        timeEndValue: 0,
        timeStartValue: getSeconds(minutes, seconds),
        title: '',
    }
}

export function getInitialChooserData(prefix, minutes, seconds, rounds, setMinutes, setSeconds, setRounds) {
    return {
        minutesLabel: `${prefix}minutes`,
        secondsLabel: `${prefix}seconds`,
        minutes: minutes,
        seconds: seconds,
        rounds: rounds,
        setMinutes: setMinutes,
        setSeconds: setSeconds,
        setRounds: setRounds
    }
}

export function setEditTimerConfiguration(searchParams, timer, minutes, seconds, rounds, restMinutes, restSeconds, timers) {
    const q = {
        ...searchParams,
        index: timer.index,
        type: timer.name,
        minutes: minutes,
        seconds: seconds,
        timers: timers,
    }

    if (timer.name === 'XY' || timer.name === 'Tabata') {
        q['rounds'] = rounds
    }

    if (timer.name === 'Tabata') {
        q['rest-minutes'] = restMinutes
        q['rest-seconds'] = restSeconds
    }

    return q
}

export function setAddTimerConfiguration(searchParams, type, minutes, seconds, rounds, restMinutes, restSeconds, timers) {
    const q = {
        ...searchParams,
        type: type,
        minutes: minutes,
        seconds: seconds,
        timers: timers,
    }

    if (type === 'XY' || type === 'Tabata') {
        q['rounds'] = rounds
    }

    if (type === 'Tabata') {
        q['rest-minutes'] = restMinutes
        q['rest-seconds'] = restSeconds
    }

    return q
}

export function parseTime(name, timeStartValue, timeEndValue) {
    return name === 'Stopwatch' ? getTime(parseInt(timeEndValue) - parseInt(timeStartValue)) : getTime(parseInt(timeStartValue))
}

export function saveSearchParams(searchParams, setMinutes, setSeconds, setRestMinutes, setRestSeconds, setRounds) {
    if (searchParams.get('minutes')) {
        setMinutes(parseInt(searchParams.get('minutes')))
    }

    if (searchParams.get('seconds')) {
        setSeconds(parseInt(searchParams.get('seconds')))
    }

    if (searchParams.get('rest-minutes')) {
        setRestMinutes(parseInt(searchParams.get('rest-minutes')))
    }

    if (searchParams.get('rest-seconds')) {
        setRestSeconds(parseInt(searchParams.get('rest-seconds')))
    }

    if (searchParams.get('rounds')) {
        setRounds(parseInt(searchParams.get('rounds')))
    }
}

export function saveTimerData(data, minutes, seconds, restMinutes, restSeconds, rounds) {
    if (data.name === 'Stopwatch') {
        data.component = Stopwatch
        data.subtitle = `count up to ${getFormattedTime(minutes, seconds)}`
        data.timeEndValue = getSeconds(minutes, seconds) + 1
        data.timeStartValue = 1
        data.duration = data.timeEndValue - 1
    } else if (data.name === 'Countdown') {
        data.component = Countdown
        data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        data.duration = data.timeStartValue
    } else if (data.name === 'XY') {
        data.component = XY
        data.currentRound = 0
        data.roundEndValue = 1
        data.roundStartValue = rounds
        data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        data.duration = data.timeStartValue * data.roundStartValue
    } else {
        data.component = Tabata
        data.restTimeEndValue = 0
        data.restTimeStartValue = getSeconds(restMinutes, restSeconds)
        data.currentRound = 0
        data.roundEndValue = 1
        data.roundStartValue = rounds
        data.subtitle = `work for ${getFormattedTime(minutes, seconds)} & rest for ${getFormattedTime(restMinutes, restSeconds)}`
        data.title = 'Work 🏋🏼'
        data.duration = (data.timeStartValue + data.restTimeStartValue) * data.roundStartValue
    }

    return data
}