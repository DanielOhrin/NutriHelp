import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getTickets } from "../../modules/ticketManager"

const AdminTicketList = () => {
    const [userId] = useState(JSON.parse(localStorage.getItem("mgm_user")).id),
        [tickets, setTickets] = useState([]),
        [sortedTickets, setSortedTickets] = useState([]),
        [sort, setSort] = useState({
            status: "", // Open/Closed/All -- Filter
            categoryId: 0, // 0 is all -- Filter
            msg: "" // asc or desc
        })

    useEffect(() => {
        getTickets().then(setTickets)
    }, [userId])

    useEffect(() => {
        let newTickets = [...tickets]

        if (sort.status === "open" || sort.status === "closed") {
            sort.status === "open"
                ? newTickets = newTickets.filter(ticket => ticket.dateClosed === null)
                : newTickets = newTickets.filter(ticket => ticket.dateClosed !== null)
        }

        if (sort.categoryId) {
            newTickets = newTickets.filter(ticket => ticket.ticketCategoryId === sort.categoryId)
        }

        if (sort.msg === "asc" || sort.msg === "desc") {
            newTickets = [...newTickets].sort((a, b) => sort.msg === "asc"
                ? Date.parse(a.messages.at(-1).dateSent) - Date.parse(b.messages.at(-1).dateSent)
                : Date.parse(b.messages.at(-1).dateSent) - Date.parse(a.messages.at(-1).dateSent)
            )
        }

        setSortedTickets(newTickets)
    }, [tickets, sort])

    return (
        <article id="ticket-article" className="w-full bg-gray-200" style={{ flexFlow: "column nowrap", justifyContent: "flex-start", alignItems: "center" }} >
            <section id="ticketFilters">
                <h2 className="text-center">Filters</h2>
                <div className="flex">
                    <div className="flex flex-col">
                        <label htmlFor="status">Status (Open/Closed)</label>
                        <select className="form-control" name="status" onChange={(evt) => {
                            const copy = { ...sort }

                            switch (evt.target.value) {
                                case "0":
                                    copy.status = ""
                                    break
                                case "1":
                                    copy.status = "open"
                                    break
                                case "2":
                                    copy.status = "closed"
                                    break
                                default:
                                    copy.status = ""
                            }

                            setSort(copy)
                        }}>
                            <option value="0">All</option>
                            <option value="1">Open</option>
                            <option value="2">Closed</option>
                        </select>
                    </div>
                    <div className="flex flex-col mx-4">
                        <label htmlFor="categoryId">Category</label>
                        <select className="form-control" name="categoryId" onChange={(evt) => {
                            const copy = { ...sort }
                            copy.categoryId = parseInt(evt.target.value)

                            setSort(copy)
                        }}>
                            <option value="0">Any</option>
                            <option value="1">General</option>
                            <option value="2">Feature Request</option>
                            <option value="3">Account</option>
                            <option value="4">Bug Report</option>
                        </select>
                    </div>
                    <div className="flex-col">
                        <label htmlFor="msg">Last Message</label>
                        <select className="form-control" name="msg" onChange={(evt) => {
                            const copy = { ...sort }

                            switch (evt.target.value) {
                                case "0":
                                    copy.msg = ""
                                    break
                                case "1":
                                    copy.msg = "asc"
                                    break
                                case "2":
                                    copy.msg = "desc"
                                    break
                                default:
                                    copy.msg = ""
                            }

                            setSort(copy)
                        }}>
                            <option value="0">None</option>
                            <option value="1">Old to Recent</option>
                            <option value="2">Recent to Old</option>
                        </select>
                    </div>
                </div>
            </section>
            <section id="tickets">
                <h2>Tickets</h2>
                <div className="w-full">
                    <header className="list list-headers">
                        <div>Title</div>
                        <div>Category</div>
                        <div>Last Message</div>
                        <div>Date Created</div>
                    </header>
                    {
                        sortedTickets.map(ticket => {

                            return !ticket.dateClosed
                                ? (
                                    <div key={`ticket--${ticket.id}`} className="flex justify-evenly list w-auto">
                                        <div>
                                            <Link to={`/ticket/${ticket.id}`}>{ticket.title}</Link>
                                        </div>
                                        <div>{ticket.ticketCategory?.name}</div>
                                        <div>{new Date(ticket.messages.at(-1).dateSent).toLocaleDateString()}</div>
                                        <div>{new Date(ticket.dateOpened).toLocaleDateString()}</div>
                                    </div>
                                )
                                : <></>
                        })
                    }
                </div>
            </section>
        </article >
    )
}

export default AdminTicketList