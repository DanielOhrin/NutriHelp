import { useCallback, useState } from "react"
import { Button, List, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader } from "reactstrap"
import { deleteFood } from "../../../modules/userProfileManager"

const MealRow = ({ ingredient, resetState }) => {
    const [editModal, setEditModal] = useState(false)

    const confirmDelete = useCallback(() => {
        deleteFood(ingredient.ingredient.id)
            .then(res => {
                if (res.ok) {
                    setEditModal(!editModal)
                    resetState()
                }
            })
    }, [ingredient, resetState, editModal])

    const confirmEdit = useCallback(() => {
        //! Do API call here

    }, [])

    return (
        <>
            <tr>
                <td>{ingredient.ingredient.name}</td>
                <td>{ingredient.amount}</td>
                <td>{ingredient.ingredient.caloriesPerServing * ingredient.amount}</td>
                <td>
                    <Button color="primary">Edit</Button>
                    <Button onClick={() => setEditModal(!editModal)} color="danger">Delete</Button>
                </td>
            </tr>
            <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
                <ModalHeader toggle={() => setEditModal(!editModal)}>Confirmation</ModalHeader>
                <ModalBody className="flex-col-center">
                    <List>
                        <ListGroup>
                            <ListGroupItem>{ingredient.ingredient.name}</ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Base serving size">Serving Size:</abbr> {ingredient.ingredient.quantity} {ingredient.ingredient.measurement}
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of calories for one serving.">Calories:</abbr> {ingredient.ingredient.caloriesPerServing} kcal
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of servings">Amount:</abbr> {ingredient.amount}
                            </ListGroupItem>
                        </ListGroup>
                    </List>
                    Are you sure you want to delete this item?
                    <div className="mt-2">
                        <Button className="mr-4" onClick={() => setEditModal(!editModal)}>Cancel</Button>
                        <Button color="primary" onClick={confirmDelete}>Confirm</Button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default MealRow