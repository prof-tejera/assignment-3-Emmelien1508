import { Link } from 'react-router-dom'
import Button from '../../atoms/button/Button'
import WorkoutSummary from '../../organisms/workout-summary/WorkoutSummary'
import './History.css'

export default function History(props) {
    const workoutHistory = JSON.parse(localStorage.getItem('history'))
    
    return (
        <div className="workout-history">
            {workoutHistory.length === 0 && (
                <div className='history-empty blurred-dark'>
                    <p className='text-md'>Create your first workout!</p>
                    <Link to='/add'><Button classes='primary'>Add a timer</Button></Link>
                </div>
            )}

            {workoutHistory.length > 0 && workoutHistory.map((workout, index) => (
                <WorkoutSummary 
                    key={index}
                    workoutIndex={index}
                    timers={workout}
                />
            ))}
        </div>
    )
}