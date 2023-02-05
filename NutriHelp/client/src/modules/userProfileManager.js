import { getCurrentUID, getToken } from "./authManager";

const _apiUrl = "/api/userprofile";

export const isDuplicateUserData = (field, value) => {
    return fetch(`${_apiUrl}/isDuplicateData?field=${field}&value=${value}`)
        .then(res => res.json())
}

export const getCurrentProfile = (showDetailsBool) => {
    const firebaseId = getCurrentUID()

    return getToken().then(token => {
        return fetch(`${_apiUrl}/${firebaseId}${[null, undefined].includes(showDetailsBool) ? '/' : `?showDetails=${showDetailsBool}`}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.json())
}