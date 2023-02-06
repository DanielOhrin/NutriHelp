import { useCallback, useEffect, useState } from "react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { editStat, getCurrentProfile } from "../../modules/userProfileManager"
import logo from "../../assets/images/company_logo.png"
import "./daily.css"

const Daily = () => {
    const [userProfile, setUserProfile] = useState({}),
        [dropdownOpen, setDropdownOpen] = useState(false),
        [statType, setStatType] = useState("Weight"),
        [modal, setModal] = useState(false),
        [stats, setStats] = useState({}), //! Hard Edit
        [addStats, setAddStats] = useState({ //! Add
            exerciseMinutes: 0,
            waterConsumed: 0,
        })

    const getUserProfile = useCallback(() => {
        return getCurrentProfile(true).then(data => {
            setUserProfile(data)
            setStats({
                exerciseMinutes: data.dailyStats.exerciseMinutes,
                waterConsumed: data.dailyStats.waterConsumed,
                weight: data.weight
            })
        })
    }, [])

    useEffect(() => {
        getUserProfile()
    }, [getUserProfile])

    const resetState = useCallback(() => {
        getUserProfile()
        setDropdownOpen(false)
        setModal(false)
        setAddStats({ exerciseMinutes: 0, waterConsumed: 0 })
    }, [getUserProfile])

    // Reactstrap Component Toggles
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
    const toggleModal = () => setModal(!modal)

    const changeState = (e) => {
        if (e.target.name.includes("add")) {
            // Since we are only working with numbers on this page, we can treat the value as always being a number.
            if (isNaN(e.target.value)
                || e.target.value.trim() === ""
                || (parseInt(e.target.value) < 1 || parseInt(e.target.value) > 720 - userProfile.dailyStats.exerciseMinutes)) return;

            const copy = { ...addStats }
            copy[e.target.name.split("-")[1]] = parseInt(e.target.value)

            setAddStats(copy)
        }
    }

    const addToStat = (e) => {
        if (e.target.id === "add-exercise") {
            editStat("exerciseMinutes", parseInt(addStats.exerciseMinutes) + userProfile.dailyStats.exerciseMinutes).then(res => res.ok && resetState())
        }
    }

    const displayStat = () => {
        switch (statType) {
            case "Exercise":
                return (
                    <>
                        <div className="text-center">
                            <h4>Exercise Minutes: {userProfile.dailyStats?.exerciseMinutes}</h4>
                            <Input
                                name="add-exerciseMinutes"
                                type="number"
                                min={1}
                                max={720 - userProfile.dailyStats?.exerciseMinutes}
                                value={addStats.exerciseMinutes}
                                onChange={changeState}
                            />
                            <Button className="mt-1 mx-1" color="primary" onClick={toggleModal}>Edit Minutes</Button>
                            <Button id="add-exercise" className="mt-1 mx-1" color="success" onClick={addToStat}>Add Minutes</Button>
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