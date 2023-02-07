import { useCallback, useEffect, useState } from "react"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { getMeals } from "../../modules/userProfileManager"
import MealTable from "./MealTable"

const DailyTables = () => {
    const [meals, setMeals] = useState([]),
        [defaultTypes] = useState(["Breakfast", "Lunch", "Dinner", "Snacks"]),
        [types, setTypes] = useState([]), //! Meal Types that we have received data for
        [modal, setModal] = useState(false)

    const resetState = useCallback(() => {
        getMeals().then(data => {
            setMeals(data ?? [])
            setTypes(data ? data.map(meal => meal.mealType.name) : [])
        })
        setModal(false)
    }, [])

    const toggleModal = () => setModal(!modal)

    useEffect(() => {
        resetState()
    }, [resetState])

    return (
        <section id="user-daily-tables">
            <h1>Meals</h1>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>New Food</ModalHeader>
                <ModalBody>
                    Add API Select2 here!!!
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggleModal} color="secondary">Cancel</Button>
                    <Button color="primary">Confirm</Button>
                </ModalFooter>
            </Modal>
            <Button onClick={toggleModal} color="primary">Add Food</Button>
            <div>
                {
                    defaultTypes.map(type => {
                        if (types.includes(type)) {
                            return <MealTable key={`meal--${meals[0].id}`} mealData={meals[0]} />
                        } else {
                            return <MealTable key={`empty--${type}`} mealData={type} />
                        }
                    })
                }
            </div>
        </section>
    )
}

export default DailyTables