import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { CredentialsContext } from "../../context/CredentialsContext"
import { getTicket, closeTicket as apiCloseTicket, sendMessage as apiSendMessage } from "../../modules/ticketManager"
import "./Ticket.css"

const Ticket = () => {
    const [ticket, setTicket] = useState({}),
        [daysSinceCreation, setDaysSinceCreation] = useState(0),
        [modal, setModal] = useState(false),
        [message, setMessage] = useState("")

    const navigate = useNavigate()
    const { credentials } = useContext(CredentialsContext)
    const { ticketId } = useParams()

    useEffect(() => {
        getTicket(ticketId)
            .then(newTicket => {
                newTicket.dateOpened = new Date(newTicket.dateOpened)
                setTicket(newTicket)

                setDaysSinceCreation(differenceInDays(Date.parse(newTicket.dateOpened), Date.now()))
            })
    }, [ticketId])

    const differenceInDays = (dateOne, dateTwo) => {

        dateOne = new Date(dateOne).toDateString().split(" ")
        dateTwo = new Date(dateTwo).toDateString().split(" ")

        dateOne = new Date(`${dateOne.join(" ")}, 00:00:00`)
        dateTwo = new Date(`${dateTwo.join(" ")}, 00:00:00`)

        return Math.ceil((Date.parse(dateTwo) / 1000 - Date.parse(dateOne) / 1000) / 86400)
    }

    const renderMessages = () => {
        const messages = []

        for (let i = 0; i <= daysSinceCreation; i++) {
            //! This is the current day's start and end
            let bottomLimit = new Date(ticket.dateOpened + (86400000 * (i))).toDateString().split(" ")
            let topLimit = new Date(ticket.dateOpened + (86400000 * (i))).toDateString().split(" ")

            //! This is setting the day (mon/tue/wed) to have a comma after it
            bottomLimit[0] = `${bottomLimit[0]}, `
            topLimit[0] = `${topLimit[0]}, `

            //! Turns it into milliseconds passed since January 1, 1970
            bottomLimit = Date.parse(new Date(`${bottomLimit.join(" ")} 00:00:00`))
            topLimit = Date.parse(new Date(`${topLimit.join(" ")} 23:59:59`))

            //! Grabs the messages sent on current day in loop
            const currentMessages = ticket.messages.filter(tM => Date.parse(tM.dateSent) >= bottomLimit && Date.parse(tM.dateSent) <= topLimit)
            if (!currentMessages.length) continue

            messages.push(
                <React.Fragment key={`messages--${i}`}>
                    <h3><em>{new Date((bottomLimit)).toLocaleDateString()}</em></h3>
                    {
                        currentMessages.map(cM => {
                            return (
                                <div key={`message--${cM.id}`} className={`${cM.userProfileId === credentials.id ? "self-end" : "self-start"}`}>
                                    <span><em>{cM.userProfile?.username} | {new Date(cM.dateSent).toLocaleTimeString()}</em></span>
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
        apiCloseTicket(ticketId)
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
            apiSendMessage({
                userProfileId: credentials.id,
                ticketId: ticket.id,
                message: document.getElementById("message-input").value
            })
                .then(res => {
                    if (res.ok) {
                        getTicket(ticket.id).then(data => setTicket(data))
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
        credentials.role && ticket.userProfileId ?
            (ticket.dateClosed === null && ticket.userProfileId === credentials.id) || credentials.role === "Admin" ?
                <article id="ticket-article">
                    <section id="ticket-section" className="">
                        <h2 className="w-full text-center">{ticket.title}</h2>
                        <header className="flex-col items-center">
                            {
                                ticket.messages ? renderMessages() : <></>
                            }
                        </header>
                        <footer>
                            {
                                !ticket.dateClosed ? (
                                    <>
                                        <div id="send-message-div">
                                            <input id="message-input" type="text" value={message} onChange={(evt) => setMessage(evt.target.value)}></input>
                                            <button id="message-btn" onClick={() => sendMessage()}>Send Message</button>
                                        </div>
                                        <Button id="close-ticket-btn" onClick={() => setModal(!modal)}>Close Ticket</Button>
                                        <Modal toggle={() => setModal(!modal)} isOpen={modal}>
                                            <ModalHeader toggle={() => setModal(!modal)}>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure you want to close this ticket?</ModalBody>
                                            <ModalFooter>
                                                <Button onClick={() => setModal(!modal)}>Cancel</Button>
                                                <Button color="primary" onClick={closeTicket}>Confirm</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </>
                                ) : <></>
                            }
                        </footer>
                    </section>
                </article> : navigate('/', { replace: true })
            : <></>
    )
}

export default Ticket