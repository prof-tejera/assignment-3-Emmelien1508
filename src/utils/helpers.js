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

export function getSeconds(minutes, seconds) {
    return minutes * 60 + seconds;
}

export function getTime(time) {
    const minutes =  Math.floor((time / 60) % 60)
    const seconds = Math.floor((time) % 60)
    return { minutes, seconds }
}