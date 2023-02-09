import { useCallback, useEffect, useState } from "react"
import { Button, Form, FormGroup, FormText, Input, Label, List, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from "reactstrap"
import logo from "../../assets/images/company_logo.png"
import { getCurrentProfile } from "../../modules/userProfileManager"
import "./profile.css"

const Profile = () => {
    const [profile, setProfile] = useState({}),
        [newProfile, setNewProfile] = useState({}),
        [isEditing, setIsEditing] = useState(false),
        [activityLevels] = useState(["Sedentary", "Light/Average Exercise", "Above Average Exercise", "Extreme Exercise"]),
        [weightGoals] = useState(["Lose 2 lbs./week", "Lose 1 lb./week", "Maintain Weight", "Gain 1 lb./week", "Gain 2 lbs./week"])

    const resetState = useCallback(() => {
        getCurrentProfile(false).then(data => { data.weight = Math.floor(data.weight * 2.204623); data.height = Math.floor(data.height / 2.54); setProfile(data); setNewProfile(data) })
    }, [])

    useEffect(() => {
        resetState()
    }, [resetState])

    const changeState = (e) => {
        const copy = { ...profile }

        copy[e.target.name] = isNaN(e.target.value) || e.target.value === "" ? e.target.value : parseInt(e.target.value)

        setProfile(copy)
    }

    const submitChanges = (e) => {
        e.preventDefault()
        document.getElementById("register-submit-btn").disabled = true
        document.getElementById("register-cancel-btn").disabled = true

        // Object for database
        const userObj = { ...profile }
        userObj.height = Math.ceil(userObj.height *= 2.54) // Converts from inches to centimeters
        userObj.weight = Math.ceil(userObj.weight *= 0.453592) // Converts from lbs. to kg.

        //! Implement register here!!!!!
        // register(userObj, credentials.password)
        //     .then(res => {
        //         if (res.ok) {
        //             setTimeout(() => navigate("/"), 250)
        //         } else {
        //             logout()
        //             window.location.reload()
        //         }
        //     })
    }

    return (
        <section id="user-profile-container">
            <img id="profile-logo" src={logo} alt="Logo" />
            <div>
                <h1>Profile</h1>
                <article id="profile-article">
                    {
                        isEditing
                            ? <List>
                                <ListGroup flush>
                                    <ListGroupItem>
                                        <h5>Email</h5>
                                        {profile.email}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Username</h5>
                                        {profile.username}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Name</h5>
                                        Daniel Ohrin
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Age</h5>
                                        {Math.floor((new Date() - new Date(profile.birthDate)) / 1000 / 60 / 60 / 24 / 365)}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Gender</h5>
                                        {profile.gender}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Weight</h5>
                                        {profile.weight} lbs.
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Height</h5>
                                        {profile.height} in.
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Activity Level</h5>
                                        {activityLevels[profile.activityLevel - 1]}
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        <h5>Goal</h5>
                                        {weightGoals[profile.weightGoal - 1]}
                                    </ListGroupItem>

                                </ListGroup>
                            </List> : <Form onSubmit={submitChanges}>
                                <fieldset>
                                    <FormGroup>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            autoComplete="first-name"
                                            name="firstName"
                                            type="text"
                                            value={profile.firstName}
                                            maxLength={25}
                                            onChange={changeState}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            autoComplete="last-name"
                                            name="lastName"
                                            type="text"
                                            value={profile.lastName}
                                            maxLength={25}
                                            onChange={changeState}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="gender">Gender</Label>
                                        <select className="form-control" name="gender" onChange={changeState}>
                                            <option value="" hidden>Select Gender</option>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="birthDate">Date of Birth</Label>
                                        <Input
                                            name="birthDate"
                                            type="date"
                                            max={(new Date(new Date() - 18 * 365.25 * 24 * 60 * 60 * 1000)).toISOString().split("T")[0]}
                                            value={profile.birthDate}
                                            onChange={changeState}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="weight">Weight (lbs.)</Label>
                                        <Input
                                            name="weight"
                                            type="number"
                                            min={80}
                                            max={700}
                                            value={profile.weight}
                                            onChange={(e) => { if (e.target.value.trim() !== "" && parseInt(e.target.value) >= 80) changeState(e) }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="height">Height (in.)</Label>
                                        <Input
                                            name="height"
                                            type="number"
                                            min={36}
                                            max={80}
                                            value={profile.height}
                                            onChange={(e) => { if (e.target.value.trim() !== "" && parseInt(e.target.value) >= 36) changeState(e) }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="activityLevel">Activity Level</Label>
                                        <select className="form-control" name="activityLevel" onChange={changeState}>
                                            <option value="" hidden>Select Level</option>
                                            <option value="1">Sedentary</option>
                                            <option value="2">Light/Average Exercise</option>
                                            <option value="3">Above Average Exercise</option>
                                            <option value="4">Extreme Exercise</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="weightGoal">Weight Goal</Label>
                                        <select className="form-control" name="weightGoal" onChange={changeState}>
                                            <option value="" hidden>Select Goal</option>
                                            <option value="1">Lose 2 lbs./week</option>
                                            <option value="2">Lose 1 lb./week</option>
                                            <option value="3">Maintain Weight</option>
                                            <option value="4">Gain 1 lb./week</option>
                                            <option value="5">Gain 2 lbs./week</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button type="button" onClick={() => { setIsEditing(!isEditing) }}>Cancel</Button>
                                        <Button className="mx-4" color="primary">Register</Button>
                                    </FormGroup>
                                </fieldset>
                            </Form >
                    }
                </article>
            </div>
        </section>
    )
}

export default Profile