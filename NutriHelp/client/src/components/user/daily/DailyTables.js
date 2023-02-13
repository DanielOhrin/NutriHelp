import { useCallback, useEffect, useState } from "react"
import Select from "react-select"
import { Button, Form, Input, InputGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { addFood, getMeals } from "../../../modules/mealManager"
import ApiSearch from "./ApiSearch"
import MealTable from "./MealTable"

const DailyTables = () => {
    const [meals, setMeals] = useState([]),
        [defaultTypes] = useState(["Breakfast", "Lunch", "Dinner", "Snacks"]),
        [types, setTypes] = useState([]), //! Meal Types that we have received data for
        [modal, setModal] = useState(false),
        [formChoices, setFormChoices] = useState({ mealTypeId: 0, food: null, amount: 1 })

    const resetState = useCallback(() => {
        getMeals().then(data => {
            setMeals(data ?? [])
            setTypes(data ? data.map(meal => meal.mealType.name) : [])
        })
        setModal(false)
        setFormChoices({ mealTypeId: 0, food: null, amount: 1 })
    }, [])

    const toggleModal = () => setModal(!modal)

    const submitFood = () => {
        if (Object.values(formChoices).includes(0) || Object.values(formChoices).includes(null)) return;

        const DTO = {
            mealTypeId: formChoices.mealTypeId,
            mealIngredient: {
                amount: formChoices.amount,
                ingredient: {
                    id: formChoices.food.item_id,
                    name: formChoices.food.item_name,
                    caloriesPerServing: Math.round(formChoices.food.nf_calories),
                    quantity: formChoices.food.nf_serving_size_qty ?? 1,
                    measurement: formChoices.food.nf_serving_size_unit ?? ""
                }
            },
        }

        addFood(DTO).then(res => res.ok && resetState())
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
                                    copy.mealTypeId = e.value
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
                    <Button onClick={submitFood} color="primary">Confirm</Button>
                </ModalFooter>
            </Modal>
            <Button onClick={toggleModal} color="primary">Add Food</Button>
            <div>
                {
                    defaultTypes.map(type => {
                        if (types.includes(type) && meals.find(m => m.ingredients.length && m.mealType.name === type)) {
                            return <MealTable key={`meal--${meals.find(m => m.mealType.name === type).id}`}
                                mealData={meals.find(m => m.mealType.name === type)}
                                resetState={resetState} />
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