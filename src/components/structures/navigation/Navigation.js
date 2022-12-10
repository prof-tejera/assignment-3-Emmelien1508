import { Link } from 'react-router-dom'

import './Navigation.css'


export default function Navigation() {
    return (
        <nav className='navigation blurred-dark'>
            <ul>
                <li><Link to='/'>Workout</Link></li>
                <li><Link to='/docs'>Documentation</Link></li>
                <li><Link to='/add'>Add timer</Link></li>
            </ul>
        </nav>
    )
}