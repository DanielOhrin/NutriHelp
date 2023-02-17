import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTickets } from "../../modules/ticketManager"

const TicketList = () => {
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        getTickets().then(setTickets)
    }, [])

    return (
        <>
            {
                tickets.map(ticket => {

                    return !ticket.dateClosed
                        ? (
                            <div key={`ticket--${ticket.id}`} className="ticket-row list">
                                <div>
                                    <Link to={`/ticket/${ticket.id}`}>{ticket.title}</Link>
                                </div>
                                <div>{ticket.ticketCategory?.name}</div>
                                <div>{new Date(ticket.messages?.at(-1).dateSent).toLocaleDateString()}</div>
                                <div>{new Date(ticket.dateOpened).toLocaleDateString()}</div>
                            </div>
                        )
                        : <React.Fragment key={`closedTicket--${ticket.id}`}></React.Fragment>
                })
            }
        </>
    )
}

export default TicketList