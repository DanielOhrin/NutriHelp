import { useEffect, useState } from "react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { getCurrentProfile } from "../../modules/userProfileManager"
import logo from "../../assets/images/company_logo.png"
import "./daily.css"

const Daily = () => {
    const [userProfile, setUserProfile] = useState({}),
        [dropdownOpen, setDropdownOpen] = useState(false),
        [statType, setStatType] = useState("Weight"),
        [modal, setModal] = useState(false)

    useEffect(() => {
        getCurrentProfile(true).then(setUserProfile)
    }, [])

    // Reactstrap Component Toggles
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
    const toggleModal = () => setModal(!modal)

    const changeState = (e) => {

    }

    const displayStat = () => {
        switch (statType) {
            case "Exercise":
                return (
                    <>
                        <div>
                            <h4>Exercise Minutes: {userProfile.exerciseMinutes}</h4>
                            <Button color="primary" onClick={toggleModal}>Edit Exercise</Button>
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Exercise</ModalHeader>
                                <ModalBody>

                                    <Label for="exercise">New Value</Label>
                                    <Input
                                        name="exercise"
                                        type="number"
                                        min={1}
                                        max={720}
                                        onChange={changeState}
                                    />

                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={toggleModal}>Cancel</Button>
                                    <Button color="primary">Confirm</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </>
                )
            case "Water":
                return ""
            case "Weight":
                return ""
            default:
                return "An error occured. Please select a Stat Type"
        }
    }

    return (
        <section id="user-daily-container">
            <img id="user-daily-logo" src={logo} alt="Logo" />
            <h1>Daily Stats for {userProfile.firstName} {userProfile.lastName}</h1>
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} direction="down">
                <DropdownToggle caret>Toggle Stats</DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Stat Type</DropdownItem>
                    <DropdownItem onClick={() => setStatType("Exercise")}>Exercise</DropdownItem>
                    <DropdownItem onClick={() => setStatType("Water")}>Water</DropdownItem>
                    <DropdownItem onClick={() => setStatType("Weight")}>Weight</DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <div id="user-daily-stats-container">{displayStat()}</div>
            <div id="user-daily-tables-container">

            </div>
        </section>
    )
}

export default Daily