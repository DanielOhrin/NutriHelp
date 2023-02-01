import { getToken } from "./authManager";

const _apiUrl = "/api/userprofile";

export const isDuplicateUserData = (field, value) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/isDuplicateData?field=${field}&value=${value}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.json())
}