import Button from '../../atoms/button/Button'

import './Pagination.css'


export default function Pagination({ workoutsPerPage, totalWorkouts, paginate }) {
    const pageNumbers = []
    for (let i = 1; i <= Math.ceil(totalWorkouts / workoutsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
        <div className="pagination-container blurred-dark">
            <div className="pagination">
                {pageNumbers.map((number, index) => (
                    <Button key={index} classes='primary round' onClick={() => paginate(index + 1)}>
                        {index}
                    </Button>   
                ))}
            </div>
        </div>
     )
}