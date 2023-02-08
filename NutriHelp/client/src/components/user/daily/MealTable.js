import React, { useCallback } from "react"
import { Table } from "reactstrap"
import MealRow from "./MealRow"

const MealTable = ({ mealData, resetState }) => {
    const emptyTable = useCallback((mealType) => {
        return (
            <div className="meal-table">
                <h3>{mealType}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Food</th>
                            <th>Servings</th>
                            <th>Calories</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>None</td>
                            <td>N/A</td>
                            <td>N/A</td>
                            <td>N/A</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }, [])

    return (
        typeof mealData !== "string"
            ? <div className="meal-table">
                <h3>{mealData.mealType.name}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Food</th>
                            <th>Servings</th>
                            <th>Calories</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            mealData.ingredients.map((ing, i) => <MealRow key={`${mealData.mealType.name}--row--${i}`} ingredient={ing} resetState={resetState} />)
                        }
                    </tbody>
                </Table>
            </div>
            : emptyTable(mealData)
    )
}

export default MealTable