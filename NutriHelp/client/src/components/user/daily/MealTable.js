import { useCallback, } from "react"
import { Table } from "reactstrap"

const MealTable = ({ mealData }) => {
    const emptyTable = useCallback((mealType) => {
        return (
            <div className="meal-table">
                <h3>{mealType}</h3>
                <Table>
                    <thead>
                        <tr>
                            <th>Food</th>
                            <th>Servings</th>
                            <th>Calories (Total)</th>
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
                            <th>Calories (Total)</th>
                            <th>Modify</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>etc</td>
                            <td>etc</td>
                            <td>etc</td>
                            <td>etc</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
            : emptyTable(mealData)
    )
}

export default MealTable