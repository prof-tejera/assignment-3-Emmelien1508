export function calculateWorkoutTime(timers) {
    let time = 0
    for (let i=0; i<timers.length; i++) {
        time += timers[i].timerSeconds
    }
    return time
}

export function workoutIsDone(timers) {
    return !timers.some((timer) => timer.completed === false)
}

export function getTotalFastForwardTime(timers, activeTimerIndex) {
    let time = 0
    for (let i = 0; i <= activeTimerIndex; i++) {
        time += timers[i].timerSeconds
    }
    return time
}

export function getMiliseconds(minutes, seconds) {
    return minutes * 60000 + seconds * 1000;
}