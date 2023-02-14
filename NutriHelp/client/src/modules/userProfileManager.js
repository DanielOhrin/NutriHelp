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

export const editStat = (field, value) => {
    const firebaseId = getCurrentUID()

    return getToken().then(token => {
        return fetch(`${_apiUrl}/EditStat/${firebaseId}?field=${field}&value=${value}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })
}

export const editUser = (userProfile) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(userProfile)
        })
    })
}

export const adminGetUsers = (increment, offset, isActive) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}?increment=${increment}&offset=${offset}&isActive=${isActive}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.json())
}

export const deactivateUser = (userId) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/deactivate/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })
}

export const activateUser = (userId) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/activate/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })
}