import FAQ from "./Faq"
import logo from "../../assets/images/company_logo.png"
import "./Support.css"
import FAQs from "../../assets/js/faqs"
import TicketForm from "../tickets/TicketForm"
import TicketList from "../tickets/TicketList"
import "../tickets/Ticket.css"
import { useState } from "react"
import { Button } from "reactstrap"

const Support = () => {
    const [showForm, setShowForm] = useState(false)

    return (
        <article id="support-container">
            <img id="support-logo" src={logo} alt="Logo" />
            <h1>NutriHelp Support</h1>
            <section id="faqs-container">{FAQs.map((faq, i) => <div key={`faq--${i}`}><FAQ Q={faq.Q} A={faq.A} /></div>)}</section>
            <section id="tickets">
                <h2>Tickets</h2>
                {!showForm && <Button onClick={() => setShowForm(true)} color="primary" className="mb-1">Create New</Button>}
                <div className={!showForm ? "w-full" : "w-75"}>
                    {
                        !showForm
                            ? (
                                <>
                                    <header className="list list-headers">
                                        <div>Title</div>
                                        <div>Category</div>
                                        <div>Last Message</div>
                                        <div>Date Created</div>
                                    </header>
                                    <TicketList />
                                </>
                            )
                            : <TicketForm setShowForm={setShowForm} />
                    }
                </div>
            </section>
        </article>
    )
}

export default Support