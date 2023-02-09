import FAQ from "./Faq"
import logo from "../../assets/images/company_logo.png"
import "./support.css"
import FAQs from "../../assets/js/faqs"

const Support = () => {
    return (
        <article id="support-container">
            <img id="support-logo" src={logo} alt="Logo" />
            <h1>NutriHelp Support</h1>
            <section id="faqs-container">{FAQs.map(faq => <div><FAQ Q={faq.Q} A={faq.A} /></div>)}</section>
            <section id="support-tickets-container">
                <h2>Tickets</h2>
                <p>Coming soon...</p>
            </section>
        </article>
    )
}

export default Support