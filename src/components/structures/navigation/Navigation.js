import { Link } from 'react-router-dom'

export default function Navigation() {
    return (
        <>
            <ul>
                <li><Link to='/'>Workout</Link></li>
                <li><Link to='/docs'>Documentation</Link></li>
                <li><Link to='/add'>Add timer</Link></li>
            </ul>
        </>
    )
}