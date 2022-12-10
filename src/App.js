import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import AddTimer from './components/structures/add-timer/AddTimer'
import Documentation from './components/structures/documentation/Documentation'
import History from './components/structures/history/History'
import Navigation from './components/structures/navigation/Navigation'
import Workout from './components/structures/workout/Workout'
import Timers from './context/TimerContext'


export default function App() {
    return (
        <div className='container'>
            <Timers>
                <Router basename="/assignment-3-Emmelien1508">
                    <Navigation />
                    <Routes>
                        <Route path='/' element={<Workout />} />
                        <Route path='/docs' element={<Documentation/>} />
                        <Route path='/add' element={<AddTimer />} />
                        <Route path='/history' element={<History />} />
                    </Routes>
                </Router>
            </Timers>
        </div>
    )
}
