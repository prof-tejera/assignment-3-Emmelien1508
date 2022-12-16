import PropTypes from 'prop-types'

import './Button.css'


export default function Button({classes, onClick, children}) {
    return (
        <div className={`button ${classes ? classes : ''}`} onClick={onClick}>
            {children}
        </div>
    )
}

Button.propTypes = {
    classes: PropTypes.string, 
    onClick: PropTypes.func, 
    children: PropTypes.any
}