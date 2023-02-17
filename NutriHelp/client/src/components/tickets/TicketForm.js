import { useContext, useState } from "react"
import { Button, Form, Input, InputGroup, Label } from "reactstrap"
import { CredentialsContext } from "../../context/CredentialsContext"
import { getTickets, createTicket } from "../../modules/ticketManager"
import { getTicket } from "../../modules/ticketManager"

const TicketForm = ({ setShowForm, resetState }) => {
    const [ticketInfo, setTicketInfo] = useState({
        title: "",
        ticketCategoryId: 0,
    }),
        [firstMsg, setFirstMsg] = useState("")

    const { credentials } = useContext(CredentialsContext)

    const handleUserInput = (evt) => {
        const copy = { ...ticketInfo }

        isNaN(parseInt(evt.target.value))
            ? copy[evt.target.name] = evt.target.value
            : copy[evt.target.name] = parseInt(evt.target.value)

        setTicketInfo(copy)
    }

    const createList = (evt) => {
        evt.preventDefault()
        document.getElementById('createTicket-btn').disabled = true


        if (ticketInfo.title.replaceAll(" ", "") !== "" && !Object.values(ticketInfo).includes(0) && firstMsg.replaceAll(" ", "") !== "") {
            createTicket({
                ...ticketInfo,
                userProfileId: credentials.id,
                messages: [{
                    userProfileId: credentials.id,
                    message: firstMsg
                }]
            })
                .then(res => {
                    if (res.ok) {
                        setShowForm(false)
                    } else {
                        document.getElementById('createTicket-btn').disabled = false
                        window.alert('Something went wrong.')
                    }

                })
        } else {
            document.getElementById('createTicket-btn').disabled = false
            window.alert("Please fill out the entire form.")
        }
    }

    return <Form className="flex flex-col">
        <InputGroup className="flex flex-col">
            <Label htmlFor="title">Title</Label>
            <Input className="w-100" type="text" name="title" value={ticketInfo.title} onChange={handleUserInput} />
        </InputGroup>
        <InputGroup className="flex flex-col">
            <Label htmlFor="ticketCategoryId">Category</Label>
            <select className="form-control w-100" name="ticketCategoryId" onChange={handleUserInput}>
                <option value="0" hidden>Select Category</option>
                <option value="1">Bug Report</option>
                <option value="2">General Support</option>
                <option value="3">Feature Request</option>
                <option value="4">Other</option>
            </select>
        </InputGroup>
        <InputGroup className="flex flex-col">
            <Label htmlFor="message">Message</Label>
            <Input className="w-100" type="text" name="message" onChange={(evt) => setFirstMsg(evt.target.value)} />
        </InputGroup>
        <div className="mt-2">
            <Button className="p-2 w-fit" onClick={(evt) => { evt.preventDefault(); setShowForm(false) }}>Cancel</Button>
            <Button color="primary" id="createTicket-btn" className="p-2 w-fit ml-4" onClick={createList}>Create Ticket</Button>
        </div>
    </Form>
}
export default TicketForm