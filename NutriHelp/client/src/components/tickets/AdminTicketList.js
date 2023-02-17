import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { fetchTicketCategories, fetchTickets } from "../../ApiManager"

const AdminTicketList = () => {
    const [userId] = useState(JSON.parse(localStorage.getItem("mgm_user")).id),
        [tickets, setTickets] = useState([]),
        [sortedTickets, setSortedTickets] = useState([]),
        [sort, setSort] = useState({
            status: "", // Open/Closed/All -- Filter
            categoryId: 0, // 0 is all -- Filter
            msg: "" // asc or desc
        }),
        [categories, setCategories] = useState([])

    useEffect(() => {
        fetchTickets(`?_expand=ticketCategory&_embed=ticketMessages`)
            .then(res => res.json())
            .then(data => setTickets(data))

        fetchTicketCategories()
            .then(res => res.json())
            .then(data => setCategories(data))
    }, [userId])

    useEffect(() => {
        let newTickets = [...tickets]

        if (sort.status === "open" || sort.status === "closed") {
            sort.status === "open"
                ? newTickets = newTickets.filter(ticket => ticket.dateClosed === "")
                : newTickets = newTickets.filter(ticket => ticket.dateClosed !== "")
        }

        if (sort.categoryId) {
            newTickets = newTickets.filter(ticket => ticket.ticketCategoryId === sort.categoryId)
        }

        if (sort.msg === "asc" || sort.msg === "desc") {
            newTickets = [...newTickets].sort((a, b) => sort.msg === "asc"
                ? a.ticketMessages.at(-1).datetime - b.ticketMessages.at(-1).datetime
                : b.ticketMessages.at(-1).datetime - a.ticketMessages.at(-1).datetime
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
                        <select name="status" onChange={(evt) => {
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
                    <div className="flex flex-col mx-12">
                        <label htmlFor="categoryId">Category</label>
                        <select name="categoryId" onChange={(evt) => {
                            const copy = { ...sort }
                            copy.categoryId = parseInt(evt.target.value)

                            setSort(copy)
                        }}>
                            <option value="0">Any</option>
                            {
                                categories.map(cat => {
                                    return <option key={`category--${cat.id}`} value={cat.id}>{cat.label}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="msg">Last Message</label>
                        <select name="msg" onChange={(evt) => {
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
            <section id="tickets" className="flex flex-col items-center w-3/5">
                <h2>Tickets</h2>
                <div className="w-full">
                    <header className="flex justify-evenly list w-auto list-headers">
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
                                        <div>{ticket.ticketCategory?.label}</div>
                                        <div>{new Date(ticket.ticketMessages.at(-1).datetime * 1000).toLocaleDateString()}</div>
                                        <div>{new Date(ticket.dateOpened * 1000).toLocaleDateString()}</div>
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