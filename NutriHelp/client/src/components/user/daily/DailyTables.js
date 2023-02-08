import { useCallback, useEffect, useState } from "react"
import Select from "react-select"
import { Button, Form, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { getMeals } from "../../../modules/userProfileManager"
import ApiSearch from "./ApiSearch"
import MealTable from "./MealTable"

const DailyTables = () => {
    const [meals, setMeals] = useState([]),
        [defaultTypes] = useState(["Breakfast", "Lunch", "Dinner", "Snacks"]),
        [types, setTypes] = useState([]), //! Meal Types that we have received data for
        [modal, setModal] = useState(false),
        [formChoices, setFormChoices] = useState({ mealType: 0, food: null, amount: 1 })

    const resetState = useCallback(() => {
        getMeals().then(data => {
            setMeals(data ?? [])
            setTypes(data ? data.map(meal => meal.mealType.name) : [])
        })
        setModal(false)
    }, [])

    const toggleModal = () => setModal(!modal)
    
    const addFood = useCallback(() => {
        if (Object.values(formChoices).includes(0) || Object.values(formChoices).includes(null)) return;

        //! Do Api call here!

    }, [])

    }


    useEffect(() => {
        resetState()
    }, [resetState])

    return (
        <section id="user-daily-tables">
            <h1>Meals</h1>
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>New Food</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => e.preventDefault()}>
                        <InputGroup className="add-food-div">
                            <Label for="meal-type">Meal</Label>
                            <Select name="meal-type"
                                options={[{ value: 1, label: "Breakfast" }, { value: 2, label: "Lunch" }, { value: 3, label: "Dinner" }, { value: 4, label: "Snacks" }]}
                                onChange={e => {
                                    const copy = { ...formChoices }
                                    copy.mealType = e.value
                                    setFormChoices(copy)
                                }} />
                        </InputGroup>
                        <InputGroup className="add-food-div">
                            <Label for="api-search">Food</Label>
                            <ApiSearch name="api-search" formChoices={formChoices} setFormChoices={setFormChoices} />
                        </InputGroup>
                        <InputGroup className="add-food-div">
                            <Label for="food-amount">Servings</Label>
                            <Input type="number" value={formChoices.amount} min={1}
                                onChange={e => {
                                    if (!isNaN(e.target.value) && isFinite(e.target.value) && e.target.value.trim() !== "") {
                                        const copy = { ...formChoices }
                                        copy.amount = parseInt(e.target.value)
                                        setFormChoices(copy)
                                    }
                                }} />
                        </InputGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggleModal} color="secondary">Cancel</Button>
                    <Button onClick={addFood} color="primary">Confirm</Button>
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