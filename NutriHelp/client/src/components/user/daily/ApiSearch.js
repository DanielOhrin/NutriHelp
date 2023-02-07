import { useCallback, useEffect, useRef, useState } from "react";
import Select from "react-select";

const ApiSearch = () => {
    const [options, setOptions] = useState([]),
        [dataset, setDataset] = useState([]),
        debounce = useRef(null)

    useEffect(() => {
        return () => clearTimeout(debounce.current)
    }, [])

    const updateOptions = useCallback(
        (userInput) => {
            clearTimeout(debounce.current)
            debounce.current = setTimeout(() => {

                getFoodByName(userInput).then(data => {
                    setDataset(data.hits)

                    setOptions(data.hits.map(foodItem => {
                        return { value: foodItem.fields.item_id, label: foodItem.fields.item_name }
                    }))
                })
            }, 500)
        }, [])

    return (
        <Select options={options} onInputChange={updateOptions} />
    )
};

export default ApiSearch;


async function getFoodByName(foodName) {
    const res = await fetch(`https://api.nutritionix.com/v1_1/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        "appId": process.env.NUTRITIONIX_API_ID,
        "appKey": process.env.NUTRITIONIX_API_KEY,
        body: JSON.stringify({
            fields: ["item_id", "item_name", "brand_name", "nf_calories", "nf_serving_size_qty", "nf_serving_size_unit"],
            queries: {
                "item_name": `${foodName}`
            }
        })
    })
    return await res.json();
};