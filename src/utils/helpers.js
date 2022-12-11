export function calculateWorkoutTime(timers) {
    if (timers === null) {
        return 0
    }
    
    let time = 0
    for (let i=0; i<timers.length; i++) {
        time += timers[i].timerMiliseconds
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

export function getTimerData(props) {
    let data = {
        animated: props.running && !props.completed,
        compact: props.compact ? props.compact : false,
        currentTime: props.completed ? props.timeEndValue : props.timeStartValue,
        duration: props.name === 'Stopwatch' ? props.timeEndValue : props.timeStartValue,
        index: props.index,
        name: props.name,
        size: props.size,
        subtitle: props.subtitle,
        timeEndValue: props.timeEndValue,
        timeStartValue: props.timeStartValue,
        currentRound: (props.name === 'XY' || props.name === 'Tabata') ? 0 : null,
        title: props.name === 'Tabata' ? 'Work 🏋🏼' : null,
        restTimeStartValue: (props.name === 'XY' || props.name === 'Tabata') ? props.restTimeStartValue : null,
        roundStartValue: (props.name === 'XY' || props.name === 'Tabata') ? props.roundStartValue : null
    }

    return data
}

export function getRunningTimerData(props, { paused, stopped, time, restTime, isWorkTime, round }) {
    let data = {
        animated: (!paused && !stopped) && (time > 0 || (time === 0 && restTime > 0)),
        compact: props.compact ? props.compact : false,
        currentTime: (props.name === 'Tabata' && !isWorkTime ) ? restTime : time,
        duration: (props.name === 'Tabata' && !isWorkTime) ? props.restTimeStartValue : props.duration,
        index: props.index,
        name: props.name,
        size: props.size,
        subtitle: props.subtitle,
    }

    if (props.name === 'Tabata') {
        data.title = !isWorkTime ? 'Rest 🧘🏼' : 'Work 🏋🏼'
        data.duration = props.roundStartValue * (props.restTimeStartValue + props.timeStartValue)

        if (!paused && !stopped && time === 0 && restTime === 0) {
            data.currentRound = 0
        }
    }

    if (props.name === 'XY') {
        data.duration = props.roundStartValue * props.timeStartValue
    }

    if (props.name === 'Tabata' || props.name === 'XY') {
        data.currentRound = round
        data.roundStartValue = props.roundStartValue
    }

    return data
}