import './Button.css'


export default function Button({classes, onClick, children}) {
    return (
        <div className={`button ${classes ? classes : ''}`} onClick={onClick}>
            {children}
        </div>
    )
}