import { useState } from 'react'
import { Link } from 'react-router-dom'

import WorkoutSummary from '../../organisms/workout-summary/WorkoutSummary'
import Pagination from '../../molecules/pagination/Pagination'
import Button from '../../atoms/button/Button'

import './History.css'


export default function History() {
    const [currentPage, setCurrentPage] = useState(1)
    const [workoutsPerPage] = useState(10)
    const workoutHistory = JSON.parse(localStorage.getItem('history'))
    
    const indexOfLastWorkout = currentPage * workoutsPerPage
    const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage
    const currentWorkouts = workoutHistory !== null ? workoutHistory.slice(indexOfFirstWorkout, indexOfLastWorkout) : []

    function paginate(pageNumber) {
        setCurrentPage(pageNumber)
    }

    return (
        <div className='workout-history'>
            {(workoutHistory === null || workoutHistory.length === 0) && (
                <div className='history-empty blurred-dark'>
                    <p className='text-md'>Create your first workout!</p>
                    <Link to='/add'><Button classes='primary'>Add a timer</Button></Link>
                </div>
            )}

            {currentWorkouts !== null && currentWorkouts.length > 0 && currentWorkouts.map((workout, index) => (
                <WorkoutSummary 
                    key={index}
                    workoutIndex={index + ((currentPage - 1) * workoutsPerPage)}
                    timers={workout}
                />
            ))}

            {currentWorkouts !== null && currentWorkouts.length > 10 && (
                <Pagination
                    workoutsPerPage={workoutsPerPage}
                    totalWorkouts={workoutHistory.length}
                    paginate={paginate}
                />
            )}
        </div>
    )
}