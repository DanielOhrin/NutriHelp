import { PaginationLink, Pagination as PaginationContainer } from "reactstrap"

const Pagination = ({ total, offset, increment, setOffset }) => {
    return (
        <PaginationContainer>
            {
                offset > 0 &&
                <PaginationLink onClick={() => setOffset(offset - increment)}>Previous</PaginationLink>
            }
            {
                total > offset + increment &&
                <PaginationLink onClick={() => setOffset(offset + increment)}>Next</PaginationLink>
            }
        </PaginationContainer>
    )
}

export default Pagination 