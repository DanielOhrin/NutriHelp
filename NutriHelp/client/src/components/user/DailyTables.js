import { useCallback, useEffect, useState } from "react"
import { getMeals } from "../../modules/userProfileManager"
import MealTable from "./MealTable"

const DailyTables = () => {
    const [meals, setMeals] = useState([]),
        [defaultTypes] = useState(["Breakfast", "Lunch", "Dinner", "Snacks"]),
        [types, setTypes] = useState([]) //! Meal Types that we have received data for

    const resetState = useCallback(() => {
        getMeals().then(data => {
            setMeals(data ?? [])
            setTypes(data ? data.map(meal => meal.mealType.name) : [])
        })
    }, [])

    useEffect(() => {
        resetState()
    }, [resetState])

    return (
        <section id="user-daily-tables">
            <h1>Meals</h1>
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