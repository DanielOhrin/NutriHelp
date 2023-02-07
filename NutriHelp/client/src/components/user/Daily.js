import { useCallback, useEffect, useState } from "react"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import { editStat, getCurrentProfile } from "../../modules/userProfileManager"
import logo from "../../assets/images/company_logo.png"
import "./daily.css"

const Daily = () => {
    const [userProfile, setUserProfile] = useState({}),
        [dropdownOpen, setDropdownOpen] = useState(false),
        [statType, setStatType] = useState("Exercise"),
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
                weight: Math.floor(data.weight * 2.204623)
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
        if (isNaN(e.target.value) || e.target.value.trim() === "") return;
        if (e.target.name.includes("add")) {
            const copy = { ...addStats }

            if (e.target.name.includes("exerciseMinutes")) {
                if ((parseInt(e.target.value) < 1 || parseInt(e.target.value) > 720 - userProfile.dailyStats.exerciseMinutes)) return;

            } else if (e.target.name.includes("waterConsumed")) {
                if ((parseInt(e.target.value) < 1 || parseInt(e.target.value) > 700 - userProfile.dailyStats.waterConsumed)) return;
            }

            copy[e.target.name.split("-")[1]] = parseInt(e.target.value)
            setAddStats(copy)
        } else {
            //! Hard-Edit Conditionals Here
            const copy = { ...stats }

            if (e.target.name === "exercise") {
                if (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 720) return;

                copy.exerciseMinutes = parseInt(e.target.value)
            } else if (e.target.name === "water") {
                if (parseInt(e.target.value) < 0 || parseInt(e.target.value) > 700) return;

                copy.waterConsumed = parseInt(e.target.value)
            } else if (e.target.name === "weight") {
                if (parseInt(e.target.value) < 80 || parseInt(e.target.value) > 700) return;

                copy.weight = parseInt(e.target.value)
            }

            setStats(copy)
        }
    }

    const addToStat = (e) => {
        switch (e.target.id) {
            case "add-exercise-btn":
                if (addStats.exerciseMinutes === 0) return;
                editStat("exerciseMinutes", addStats.exerciseMinutes + userProfile.dailyStats.exerciseMinutes).then(res => res.ok && resetState())
                return
            case "add-water-btn":
                if (addStats.waterConsumed === 0) return;
                editStat("waterConsumed", addStats.waterConsumed + userProfile.dailyStats.waterConsumed).then(res => res.ok && resetState())
                return
            default:
                throw new Error("Stat Not Found")
        }
    }

    const hardEditStat = (e) => {
        switch (e.target.id) {
            case "edit-exercise-btn":
                editStat("exerciseMinutes", stats.exerciseMinutes).then(res => res.ok && resetState())
                return
            case "edit-water-btn":
                editStat("waterConsumed", stats.waterConsumed).then(res => res.ok && resetState())
                return
            case "edit-weight-btn":
                editStat("weight", Math.round(stats.weight * 0.453592)).then(res => res.ok && resetState())
                return
            default:
                throw new Error("Stat Not Found")
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
                            <Button id="add-exercise-btn" className="mt-1 mx-1" color="success" onClick={addToStat}>Add Minutes</Button>
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Exercise</ModalHeader>
                                <ModalBody>
                                    <Label for="exercise">New Value</Label>
                                    <Input
                                        name="exercise"
                                        type="number"
                                        min={0}
                                        max={720}
                                        value={stats.exerciseMinutes}
                                        onChange={changeState}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={toggleModal}>Cancel</Button>
                                    <Button id="edit-exercise-btn" onClick={hardEditStat} color="primary">Confirm</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </>
                )
            case "Water":
                return (
                    <>
                        <div className="text-center">
                            <h4>Water Remaining: {userProfile.dailyStats?.waterGoal - userProfile.dailyStats?.waterConsumed} oz.</h4>
                            <h4>Amount Drank: {userProfile.dailyStats?.waterConsumed} oz.</h4>
                            <Input
                                name="add-waterConsumed"
                                type="number"
                                min={1}
                                max={700}
                                value={addStats.waterConsumed}
                                onChange={changeState}
                            />
                            <Button className="mt-1 mx-1" color="primary" onClick={toggleModal}>Edit Ounces</Button>
                            <Button id="add-water-btn" className="mt-1 mx-1" color="success" onClick={addToStat}>Add Ounces</Button>
                            <Modal isOpen={modal} toggle={toggleModal}>
                                <ModalHeader toggle={toggleModal}>Water (oz.)</ModalHeader>
                                <ModalBody>
                                    <Label for="water">New Value</Label>
                                    <Input
                                        name="water"
                                        type="number"
                                        min={0}
                                        max={700}
                                        value={stats.waterConsumed}
                                        onChange={changeState}
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={toggleModal}>Cancel</Button>
                                    <Button id="edit-water-btn" onClick={hardEditStat} color="primary">Confirm</Button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </>
                )
            case "Weight":
                return (
                    <div className="text-center">
                        <h4>Current Weight: {Math.floor(userProfile.weight * 2.204623)} lbs.</h4>
                        <Input
                            name="weight"
                            type="number"
                            min={80}
                            max={700}
                            value={stats.weight}
                            onChange={changeState}
                        />
                        <Button id="edit-weight-btn" className="w-100 mt-1" onClick={hardEditStat} color="primary">Edit Weight</Button>
                    </div>
                )
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