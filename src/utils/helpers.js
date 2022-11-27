export function calculateWorkoutTime(timers) {
    let time = 0
    for (let i=0; i<timers.length; i++) {
        time += timers[i].timerMiliseconds
    }
    return time
}

export function workoutIsDone(timers) {
    return !timers.some((timer) => timer.completed === false)
}

export function getTotalFastForwardTime(timers, activeTimerIndex) {
    let time = 0
    for (let i = 0; i <= activeTimerIndex; i++) {
        time += timers[i].timerMiliseconds
    }
    return time
}

export function getMiliseconds(minutes, seconds) {
    return minutes * 60000 + seconds * 1000;
}

export function getTime(time) {
    const minutes =  Math.floor((time / 60000) % 60)
    const seconds = Math.floor((time / 1000) % 60)
    const miliseconds = ((time / 10) % 100)
    return { minutes, seconds, miliseconds }
}