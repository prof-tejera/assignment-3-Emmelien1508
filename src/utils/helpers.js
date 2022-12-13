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

export function getInitialChooserData(prefix, minutes, seconds, setMinutes, setSeconds) {
    return {
        minutesLabel: `${prefix}minutes`,
        secondsLabel: `${prefix}seconds`,
        minutes: minutes,
        seconds: seconds,
        setMinutes: setMinutes,
        setSeconds: setSeconds,
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