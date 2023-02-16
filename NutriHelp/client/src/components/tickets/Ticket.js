import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetchTicketMessages, fetchTickets } from "../../ApiManager"
import "./Ticket.css"
export const Ticket = () => {
    const [ticket, setTicket] = useState({}),
        [ticketMessages, setTicketMessages] = useState([]),
        [userId, setUserId] = useState(0),
        [daysSinceCreation, setDaysSinceCreation] = useState(0),
        [wantsToClose, setWantsToClose] = useState(false),
        [message, setMessage] = useState("")

    const { ticketId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetchTickets(`/${ticketId}`)
            .then(res => res.json())
            .then(data => {
                setTicket(data)
                setDaysSinceCreation(differenceInDays(data.dateOpened, (Date.now() / 1000)))
            })

        fetchTicketMessages(`?ticketId=${ticketId}&_expand=user`)
            .then(res => res.json())
            .then(data => setTicketMessages(data))

        setUserId(JSON.parse(localStorage.getItem("mgm_user")).id)
    }, [ticketId, userId])

    useEffect(() => {
        throw new Error('Not Implemented Yet')
        if (ticket.userId) {
            // I do realize they can still see the ticket data through the network tab
            if (userId !== ticket.userId && !JSON.parse(localStorage.getItem("mgm_user")).isStaff) {
                navigate("/support", { replace: true })
                return;
            }
        }
    }, [ticket, userId, navigate])

    const differenceInDays = (dateOne, dateTwo) => {

        dateOne = new Date(dateOne * 1000).toDateString().split(" ")
        dateTwo = new Date(dateTwo * 1000).toDateString().split(" ")

        dateOne[1] = `${dateOne[1]},`
        dateTwo[1] = `${dateTwo[1]},`

        dateOne = new Date(`${dateOne.join(" ")} 00:00:00`)
        dateTwo = new Date(`${dateTwo.join(" ")} 00:00:00`)

        return Math.ceil((Date.parse(dateTwo) / 1000 - Date.parse(dateOne) / 1000) / 86400)
    }

    const renderMessages = () => {
        const messages = []


        for (let i = 0; i <= daysSinceCreation; i++) {
            let bottomLimit = new Date((ticket.dateOpened + (86400 * (i))) * 1000).toDateString().split(" ")
            let topLimit = new Date((ticket.dateOpened + (86400 * (i))) * 1000).toDateString().split(" ")

            bottomLimit = Date.parse(new Date(`${bottomLimit.join(" ")}, 00:00:00`)) / 1000
            topLimit = Date.parse(new Date(`${topLimit.join(" ")}, 23:59:59`)) / 1000

            const currentMessages = ticketMessages.filter(tM => tM.datetime >= bottomLimit && tM.datetime <= topLimit)

            if (!currentMessages.length) continue

            messages.push(
                <React.Fragment key={`message--${message.id}`}>
                    <h3><em>{new Date((bottomLimit * 1000)).toLocaleDateString()}</em></h3>
                    {
                        currentMessages.map(cM => {
                            return (
                                <div key={`message--${cM.id}`} className={`${cM.userId === userId ? "self-end" : "self-start"}`}>
                                    <span><em>{cM.user?.username} | {new Date(cM.datetime * 1000).toLocaleTimeString()}</em></span>
                                    {cM.message}
                                </div>
                            )
                        })
                    }
                </React.Fragment>
            )
        }

        return messages
    }

    const closeTicket = () => {
        fetchTickets(`/${ticket.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(ticket)
        })
            .then(res => {
                if (res.ok) {
                    navigate("/support", { replace: true })
                } else {
                    window.alert('Something went wrong.')
                }
            })
    }

    const sendMessage = () => {
        const sendBtn = document.getElementById("message-btn")
        sendBtn.disabled = true

        if (message.replaceAll(" ", "") !== "") {
            fetchTicketMessages(`/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ticketId: ticket.id,
                    userId: userId,
                    datetime: Math.round(Date.now() / 1000),
                    message: document.getElementById("message-input").value
                })
            })
                .then(res => {
                    if (res.ok) {
                        fetchTicketMessages(`?ticketId=${ticketId}&_expand=user`)
                            .then(res => res.json())
                            .then(data => setTicketMessages(data))
                        setMessage("")
                        sendBtn.disabled = false
                    } else {
                        window.alert('Something went wrong.')
                        sendBtn.disabled = false
                    }
                })
        } else {
            window.alert("Please specify a message.")
            sendBtn.disabled = false
        }
    }

    return (
        <article id="ticket-article" className="w-full bg-gray-200">
            <section id="ticket-section" className="">
                <h2 className="w-full text-center">{ticket.title}</h2>
                <header className="flex flex-col items-center">
                    {
                        renderMessages()
                    }
                </header>
                <footer>
                    {
                        !ticket.dateClosed ? (
                            <div className="flex flex-row justify-between">
                                <input id="message-input" className="w-5/6" type="text" value={message} onChange={(evt) => setMessage(evt.target.value)}></input>
                                <button id="message-btn" onClick={() => sendMessage()}>Send Message</button>
                            </div>
                        )
                            : <></>
                    }
                    {
                        !JSON.parse(localStorage.getItem("mgm_user")).isStaff
                            ? <button className="mr-4" onClick={() => setWantsToClose(true)}>Close Ticket</button>
                            : <></>
                    }
                    {
                        wantsToClose
                            ? (
                                <>
                                    <span>Are You Sure?</span>
                                    <button className="mx-2" onClick={() => setWantsToClose(false)}>No</button>
                                    <button onClick={() => closeTicket()}>Yes</button>
                                </>
                            )
                            : ""
                    }

                </footer>
            </section>
        </article>
    )
}

