import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTickets } from "../../modules/ticketManager"

export const TicketList = () => {
    const [userId] = useState(JSON.parse(localStorage.getItem("mgm_user")).id),
        [tickets, setTickets] = useState([])

    useEffect(() => {
        getTickets(`?userId=${userId}&_expand=ticketCategory&_embed=ticketMessages`)
            .then(res => res.json())
            .then(data => setTickets(data))
    }, [userId])

    return (
        <>
            {
                tickets.map(ticket => {

                    return !ticket.dateClosed
                        ? (
                            <div key={`ticket--${ticket.id}`} className="flex justify-evenly list w-auto">
                                <div>
                                    <Link to={`/ticket/${ticket.id}`}>{ticket.title}</Link>
                                </div>
                                <div>{ticket.ticketCategory?.label}</div>
                                <div>{new Date(ticket.ticketMessages.at(-1).datetime * 1000).toLocaleDateString()}</div>
                                <div>{new Date(ticket.dateOpened * 1000).toLocaleDateString()}</div>
                            </div>
                        )
                        : <></>
                })
            }
        </>
    )
}