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