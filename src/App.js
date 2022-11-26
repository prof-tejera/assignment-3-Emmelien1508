import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Documentation from './components/organisms/documentation/Documentation'
import AddTimer from './components/organisms/add-timer/AddTimer'
import Navigation from './components/structures/navigation/Navigation'
import Workout from './components/structures/workout/Workout'
import TimerData from './context/TimerContext'


export default function App() {
    return (
        <div className='container'>
            <TimerData>
                <Router basename="/assignment-2-Emmelien1508">
                    <Navigation />
                    <Routes>
                        <Route path='/' element={<Workout />} />
                        <Route path='/docs' element={<Documentation/>} />
                        <Route path='/add' element={<AddTimer />} />
                    </Routes>
                </Router>
            </TimerData>
        </div>
    )
}
