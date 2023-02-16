import { getToken } from "./authManager"

const _apiUrl = "/api/ticket"

export const getTickets = () => {
    return getToken().then(token => {
        return fetch(_apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.json())
}

//! Ticket must include a starting ticketMessage
export const createTicket = (ticket) => {
    return getToken().then(token => {
        return fetch(_apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(ticket)
        })
    })
}

export const getTicket = (ticketId) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/${ticketId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }).then(res => res.json())
}

export const closeTicket = (ticketId) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/close/${ticketId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })
}

export const sendMessage = (ticketMessage) => {
    return getToken().then(token => {
        return fetch(`${_apiUrl}/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(ticketMessage)
        })
    })
}