import { Link } from 'react-router-dom'
import './Documentation.css'


export default function Documentation() {
    return (
        <div className="documentation blurred">
            <div>
                <p>
                    For this assignment, I've used the Atomic Design Principle. It's named that way because it’s very idea is founded in that of Chemistry, and the study of the composition of matter. The universe is made up of a fixed set of ‘atomic elements’ – known to many of us as the periodic table of elements. These elements are the building blocks of everything around us.
                </p>
                <p>
                    In Chemistry, these atomic elements have fixed properties that define them. Oxygen and Hydrogen on their own are atoms with independent properties. However when these elements are combined, they create molecules, which take on their own unique characteristics, made up of the atoms they contain. In the case of hydrogen and oxygen, pairing two hydrogen atoms with oxygen creates what we know as the water molecule.
                </p>
                <p>
                    This understanding of how smaller elements, or atoms, can be combined together to create larger objects, or molecules, parallels well with the design world, and the many elements we use to construct our designs. Following the atomic design principles provides us a structure for not only formulating our design, but creates the building blocks for constructing our design systems and pattern libraries.
                </p>
                <p>
                    Here you'll find more information on this principle:
                </p>
                <p>
                    <Link to='https://xd.adobe.com/ideas/process/ui-design/atomic-design-principles-methodology-101/'>
                        Atomic Design Principles & Methodology 101
                    </Link>
                </p>
            </div>
            <table className='blurred'>
                <thead>
                    <tr>
                        <th>Component</th>
                        <th>Size</th>
                        <th>Props</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Workout</td>
                        <td>Structure</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>Navigation</td>
                        <td>Structure</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>History</td>
                        <td>Structure</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>EditTimer</td>
                        <td>Structure</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>AddTimer</td>
                        <td>Structure</td>
                        <td>None</td>
                    </tr>
                    <tr>
                        <td>WorkoutSummary</td>
                        <td>Organism</td>
                        <td>timers, workoutIndex</td>
                    </tr>
                    <tr>
                        <td>WorkoutItems</td>
                        <td>Organism</td>
                        <td>timers, setTimers, handleReset</td>
                    </tr>
                    <tr>
                        <td>Timer</td>
                        <td>Organism</td>
                        <td> 
                            animated,
                            compact,
                            completed,
                            currentRound,
                            currentTime,
                            duration,
                            index,
                            name,
                            initialRestinitialTimeEndValue,
                            initialRestinitialTimeStartValue,
                            initialRoundEndValue,
                            initialRoundStartValue,
                            running,
                            size,
                            subtitle,
                            initialTimeEndValue,
                            initialTimeStartValue,
                            title
                        </td>
                    </tr>
                    <tr>
                        <td>InnerTimer</td>
                        <td>Organism</td>
                        <td> 
                            animated,
                            compact,
                            completed,
                            currentRound,
                            currentTime,
                            duration,
                            index,
                            name,
                            initialRestinitialTimeEndValue,
                            initialRestinitialTimeStartValue,
                            initialRoundEndValue,
                            initialRoundStartValue,
                            running,
                            size,
                            subtitle,
                            initialTimeEndValue,
                            initialTimeStartValue,
                            title
                        </td>
                    </tr>
                    <tr>
                        <td>TimePanel</td>
                        <td>Molecule</td>
                        <td>
                            animated,
                            color,
                            compact,
                            completed,
                            currentRound,
                            currentTime,
                            duration,
                            index,
                            name,
                            initialRoundStartValue,
                            running,
                            size,
                            subtitle,
                            title
                        </td>
                    </tr>
                    <tr>
                        <td>TimeChooser</td>
                        <td>Molecule</td>
                        <td>
                            minutesLabel,
                            secondsLabel,
                            minutes,
                            setMinutes,
                            seconds,
                            setSeconds
                        </td>
                    </tr>
                    <tr>
                        <td>RoundChooser</td>
                        <td>Molecule</td>
                        <td>
                            rounds, setRounds
                        </td>
                    </tr>
                    <tr>
                        <td>Pagination</td>
                        <td>Molecule</td>
                        <td>
                            workoutsPerPage, totalWorkouts, paginate
                        </td>
                    </tr>
                    <tr>
                        <td>Button</td>
                        <td>Atom</td>
                        <td>
                            classes, onClick, children
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}