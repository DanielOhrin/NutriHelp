import { useCallback, useState } from "react"
import { Button, Input, Label, List, ListGroup, ListGroupItem, Modal, ModalBody, ModalHeader } from "reactstrap"
import { deleteFood, editFood } from "../../../modules/userProfileManager"

const MealRow = ({ ingredient, resetState }) => {
    const [editModal, setEditModal] = useState(false),
        [deleteModal, setDeleteModal] = useState(false),
        [newAmount, setNewAmount] = useState(ingredient.amount)

    const confirmDelete = useCallback(() => {
        deleteFood(ingredient.ingredient.id, ingredient.mealId)
            .then(res => {
                if (res.ok) {
                    setDeleteModal(!deleteModal)
                    resetState()
                }
            })
    }, [ingredient, resetState, deleteModal])

    const confirmEdit = useCallback(() => {
        editFood(ingredient.ingredient.id, ingredient.mealId, newAmount)
            .then(res => {
                if (res.ok) {
                    setEditModal(!editModal)
                    resetState()
                }
            })

    }, [ingredient, resetState, editModal, newAmount])

    return (
        <>
            <tr>
                <td>{ingredient.ingredient.name}</td>
                <td>{ingredient.amount * ingredient.ingredient.quantity} {ingredient.ingredient.measurement}</td>
                <td>{ingredient.ingredient.caloriesPerServing * ingredient.amount}</td>
                <td>
                    <Button onClick={() => setEditModal(!editModal)} color="primary">Edit</Button>
                    <Button onClick={() => setDeleteModal(!deleteModal)} color="danger">Delete</Button>
                </td>
            </tr>
            <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)}>
                <ModalHeader toggle={() => setEditModal(!editModal)}>Confirm</ModalHeader>
                <ModalBody className="flex-col-center">
                    <List>
                        <ListGroup>
                            <ListGroupItem>{ingredient.ingredient.name}</ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Base serving size">Serving Size:</abbr> {ingredient.ingredient.quantity} {ingredient.ingredient.measurement}
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of calories for one serving">Calories:</abbr> {ingredient.ingredient.caloriesPerServing} kcal
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of servings logged">Amount:</abbr> {ingredient.amount}
                            </ListGroupItem>
                        </ListGroup>
                    </List>
                    <Label for="newAmount">New Amount</Label>
                    <Input className="w-25" name="newAmount" type="number" min={1} value={newAmount}
                        onChange={(e) => {
                            if (isNaN(e.target.value) || !isFinite(e.target.value) || e.target.value.trim() === "" || parseInt(e.target.value) === ingredient.amount) return;
                            setNewAmount(parseInt(e.target.value))
                        }}
                    />
                    <div className="mt-2">
                        <Button className="mr-4" onClick={() => setEditModal(!editModal)}>Cancel</Button>
                        <Button color="primary" onClick={confirmEdit}>Confirm</Button>
                    </div>
                </ModalBody>
            </Modal>
            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(!deleteModal)}>
                <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>Confirmation</ModalHeader>
                <ModalBody className="flex-col-center">
                    <List>
                        <ListGroup>
                            <ListGroupItem>{ingredient.ingredient.name}</ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Base serving size">Serving Size:</abbr> {ingredient.ingredient.quantity} {ingredient.ingredient.measurement}
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of calories for one serving">Calories:</abbr> {ingredient.ingredient.caloriesPerServing} kcal
                            </ListGroupItem>
                            <ListGroupItem>
                                <abbr title="Amount of servings logged">Amount:</abbr> {ingredient.amount}
                            </ListGroupItem>
                        </ListGroup>
                    </List>
                    Are you sure you want to delete this item?
                    <div className="mt-2">
                        <Button className="mr-4" onClick={() => setDeleteModal(!deleteModal)}>Cancel</Button>
                        <Button color="primary" onClick={confirmDelete}>Confirm</Button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default MealRow