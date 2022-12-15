import Timer from "../components/organisms/timer/Timer"


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

export function calculateWorkoutRemainingTime(timers) {
    if (timers === null) {
        return 0
    }

    let time = 0
    for (let i=0; i<timers.length; i++) {
        // ignore timers that are completed
        if (!timers[i].completed) {
            time += timers[i].running ? timers[i].currentTime : timers[i].duration
        }
    }
    return time
}

export function workoutIsDone(timers) {
    if (timers === null) {
        return true
    }
    return !timers.some((timer) => timer.completed === false)
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

export function getInitialTimerData(type, length, minutes, seconds) {
    return {
        animated: false,
        compact: false,
        completed: false,
        component: Timer,
        currentRound: null,
        currentTime: 0,
        duration: 0,
        index: length > 0 ? length - 1 : 0,
        name: type,
        initialRestinitialTimeEndValue: null,
        initialRestinitialTimeStartValue: null,
        initialRoundEndValue: null,
        initialRoundStartValue: null,
        running: false,
        size: 240,
        subtitle: '',
        initialTimeEndValue: 0,
        initialTimeStartValue: getSeconds(minutes, seconds),
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
    searchParams.set('index', `${timer.index}`)
    searchParams.set('type', `${timer.name}`)
    searchParams.set('minutes', `${minutes}`)
    searchParams.set('seconds', `${seconds}`)
    searchParams.set('timers', JSON.stringify(timers))

    if (timer.name === 'XY' || timer.name === 'Tabata') {
        searchParams.set('rounds', `${rounds}`)
    }

    if (timer.name === 'Tabata') {
        searchParams.set('rest-minutes', `${restMinutes}`)
        searchParams.set('rest-seconds', `${restSeconds}`)
    }

    return searchParams
}

export function setAddTimerConfiguration(searchParams, type, minutes, seconds, rounds, restMinutes, restSeconds, timers) {
    searchParams.set('type', `${type}`)
    searchParams.set('minutes', `${minutes}`)
    searchParams.set('seconds', `${seconds}`)
    searchParams.set('timers', JSON.stringify(timers))

    if (type === 'XY' || type === 'Tabata') {
        searchParams.set('rounds', `${rounds}`)
    }

    if (type === 'Tabata') {
        searchParams.set('rest-minutes', `${restMinutes}`)
        searchParams.set('rest-seconds', `${restSeconds}`)
    }

    return searchParams
}

export function parseTime(name, initialTimeStartValue, initialTimeEndValue) {
    return name === 'Stopwatch' ? getTime(parseInt(initialTimeEndValue) - parseInt(initialTimeStartValue)) : getTime(parseInt(initialTimeStartValue))
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
        data.subtitle = `count up to ${getFormattedTime(minutes, seconds)}`
        data.initialTimeEndValue = getSeconds(minutes, seconds) + 1
        data.initialTimeStartValue = 1
        data.duration = data.initialTimeEndValue - 1
    } else if (data.name === 'Countdown') {
        data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        data.duration = data.initialTimeStartValue
    } else if (data.name === 'XY') {
        data.currentRound = 0
        data.initialRoundEndValue = 1
        data.initialRoundStartValue = rounds
        data.subtitle = `count down from ${getFormattedTime(minutes, seconds)}`
        data.duration = data.initialTimeStartValue * data.initialRoundStartValue
    } else {
        data.initialRestinitialTimeEndValue = 0
        data.initialRestinitialTimeStartValue = getSeconds(restMinutes, restSeconds)
        data.currentRound = 0
        data.initialRoundEndValue = 1
        data.initialRoundStartValue = rounds
        data.subtitle = `work for ${getFormattedTime(minutes, seconds)} & rest for ${getFormattedTime(restMinutes, restSeconds)}`
        data.title = 'Work 🏋🏼'
        data.duration = (data.initialTimeStartValue + data.initialRestinitialTimeStartValue) * data.initialRoundStartValue
    }

    return data
}

function getSeconds(minutes, seconds) {
    return minutes * 60 + seconds
}

function getFormattedTime(minutes, seconds) {
    return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`
}