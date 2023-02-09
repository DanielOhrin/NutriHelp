import { ButtonGroup, PaginationLink } from "reactstrap"

const Pagination = ({ total, offset, increment, setOffset }) => {
    return (
        <ButtonGroup>
            {
                offset > 0 &&
                <PaginationLink onClick={() => setOffset(offset - increment)}>Previous</PaginationLink>
            }
            {
                total > offset + increment &&
                <PaginationLink onClick={() => setOffset(offset + increment)}>Next</PaginationLink>
            }
        </ButtonGroup>
    )
}

export default Pagination 