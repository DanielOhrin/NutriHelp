import { getToken } from "./authManager"

const _apiUrl = "/api/meal"

export const getMeals = () => {
    return getToken().then(token => {
        return fetch(_apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.status === 200 && res.json())
}

export const addFood = (DTO) => {
    return getToken().then(token => {
        return fetch(_apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(DTO)
        })
    })
}

export const deleteFood = (foodId, mealId) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}?foodId=${foodId}&mealId=${mealId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })
}

export const editFood = (foodId, mealId, newAmount) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}?foodId=${foodId}&mealId=${mealId}&newAmount=${newAmount}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        })
    })
}