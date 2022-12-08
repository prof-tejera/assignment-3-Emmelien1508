import './TimePanel.css'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function TimePanel(props) {
    const children = ({ remainingTime }) => {
        return (
            <div className='text-center'>
                <p>{props.title ? props.title : ''}</p>
                <p>{remainingTime}</p>
            </div>
        )
    }
    return (
        <div className={`time-panel ${props.classes ? props.classes : ''} ${props.animated ? 'animated' : ''}`}>
            <CountdownCircleTimer
                isPlaying={props.animated ? true : false}
                duration={props.time}
                strokeWidth={4}
                colors={['#8437e8']}
            >
                {children}
            </CountdownCircleTimer>
        </div>
    )
}