export function getTime(time) {
    const minutes =  Math.floor((time / 60000) % 60)
    const seconds = Math.floor((time / 1000) % 60)
    const miliseconds = ((time / 10) % 100)
    return { minutes, seconds, miliseconds }
}

export function capitalize(str) {
    const lower = str.toLowerCase()
    return str.charAt(0).toUpperCase() + lower.slice(1)
}

export function calculateWorkoutTime(timers) {
    let time = 0
    timers.forEach((timerData, index) => (time += timers[index].timerSecs))
    return time
}

export function getTotalFastForwardTime(timers, activeTimerIndex) {
    let time = 0
    for (let i = 0; i <= activeTimerIndex; i++) {
        time += timers[i].timerSecs
    }
    return time
}

export function getMiliseconds(minutes, seconds) {
    return minutes * 60000 + seconds * 1000;
}

export function workoutIsDone(timers) {
    return !timers.some((timer) => timer.isCompleted === false)
}