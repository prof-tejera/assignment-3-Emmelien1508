import './Button.css'


export default function Button(props) {
    return (
        <div className={`button ${props.classes ? props.classes : ''}`} onClick={props.onClick}>
            {props.children}
        </div>
    )
}