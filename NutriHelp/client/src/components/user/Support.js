import FAQ from "./Faq"
import logo from "../../assets/images/company_logo.png"
import "./support.css"
import FAQs from "../../assets/js/faqs"
import TicketForm from "../tickets/TicketForm"
import TicketList from "../tickets/TicketList"
import "../tickets/Ticket.css"
import { useState } from "react"

const Support = () => {
    const [showForm, setShowForm] = useState(false)


    return (
        <article id="support-container">
            <img id="support-logo" src={logo} alt="Logo" />
            <h1>NutriHelp Support</h1>
            <section id="faqs-container">{FAQs.map((faq, i) => <div key={`faq--${i}`}><FAQ Q={faq.Q} A={faq.A} /></div>)}</section>
            <section id="tickets" className="flex flex-col items-center w-3/5 bg-gray-200">
                <h2>Tickets</h2>
                <div className="w-full">
                    {
                        !showForm
                            ? (
                                <>
                                    <header className="flex justify-evenly list w-auto list-headers">
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