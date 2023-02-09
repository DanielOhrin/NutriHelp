import { useState } from "react"
import { Button, Card, CardBody, Collapse } from "reactstrap"

const FAQ = ({ Q, A }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button color="primary" onClick={() => setIsOpen(!isOpen)} style={{ marginBottom: '1rem' }}>{Q}</Button>
            <Collapse className="faq-card" isOpen={isOpen}>
                <Card>
                    <CardBody>{A}</CardBody>
                </Card>
            </Collapse>
        </>
    )
}

export default FAQ