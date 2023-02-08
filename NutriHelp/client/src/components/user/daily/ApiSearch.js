import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";

const ApiSearch = ({ formChoices, setFormChoices }) => {
    const [options, setOptions] = useState([]),
        [dataset, setDataset] = useState([]),
        debounce = useRef(null)

    useEffect(() => {
        return () => clearTimeout(debounce.current)
    }, [])

    const updateOptions = useCallback(
        (userInput) => {
            clearTimeout(debounce.current)

            if (userInput.trim() === "") return;

            debounce.current = setTimeout(() => {

                getFoodByName(userInput).then(data => {
                    setDataset(data.hits)

                    setOptions(data.hits.map(foodItem => {
                        return { value: foodItem.fields.item_id, label: `${foodItem.fields.item_name} - ${foodItem.fields.nf_serving_size_qty ?? 1} ${foodItem.fields.nf_serving_size_unit ?? ""} | ${foodItem.fields.nf_calories} kcal` }
                    }))
                })
            }, 500)
        }, [])

    return (
        <Select options={options} onInputChange={updateOptions} onChange={e => {
            const copy = { ...formChoices }
            copy.food = dataset.find(food => food.fields.item_id === e.value).fields
            setFormChoices(copy)
        }} />
    )
};

export default ApiSearch;


async function getFoodByName(foodName) {
    const res = await fetch(`https://api.nutritionix.com/v1_1/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            appId: process.env.REACT_APP_NUTRITIONIX_API_ID,
            appKey: process.env.REACT_APP_NUTRITIONIX_API_KEY,
            fields: ["item_id", "item_name", "nf_calories", "nf_serving_size_qty", "nf_serving_size_unit", "images_front_full_url"],
            queries: {
                "item_name": `${foodName}`
            }
        })
    })
    return await res.json();
};