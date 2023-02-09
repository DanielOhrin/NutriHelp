import { useCallback, useEffect, useState } from "react"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import logo from "../../assets/images/company_logo.png"
import { getCurrentProfile, editUser } from "../../modules/userProfileManager"
import "./profile.css"

const Profile = () => {
    const [profile, setProfile] = useState({}),
        [newProfile, setNewProfile] = useState({}),
        [isEditing, setIsEditing] = useState(false),
        [activityLevels] = useState(["Sedentary", "Light/Average Exercise", "Above Average Exercise", "Extreme Exercise"]),
        [weightGoals] = useState(["Lose 2 lbs./week", "Lose 1 lb./week", "Maintain Weight", "Gain 1 lb./week", "Gain 2 lbs./week"])

    const resetState = useCallback(() => {
        getCurrentProfile(false).then(data => { data.weight = Math.floor(data.weight * 2.204623); data.height = Math.floor(data.height / 2.54); setProfile(data); setNewProfile(data) })
        setIsEditing(false);
    }, [])

    useEffect(() => {
        resetState()
    }, [resetState])

    const changeState = (e) => {
        const copy = { ...newProfile }

        copy[e.target.name] = isNaN(e.target.value) || e.target.value === "" ? e.target.value : parseInt(e.target.value)

        setNewProfile(copy)
    }

    const submitChanges = (e) => {
        e.preventDefault()

        // Object for database
        const userObj = { ...newProfile }
        userObj.height = Math.ceil(userObj.height *= 2.54) // Converts from inches to centimeters
        userObj.weight = Math.ceil(userObj.weight *= 0.453592) // Converts from lbs. to kg.

        editUser(userObj).then(res => res.ok && resetState())
    }

    return (
        <section id="user-profile-container">
            <img id="profile-logo" src={logo} alt="Logo" />
            <div>
                <h1>Profile</h1>
                <article id="profile-article">
                    {
                        !isEditing
                            ? <>
                                <div id="profile-div">
                                    <div>
                                        <h5>Email</h5>
                                        {profile.email}
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Username</h5>
                                        {profile.username}
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Name</h5>
                                        Daniel Ohrin
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Age</h5>
                                        {Math.floor((new Date() - new Date(profile.birthDate)) / 1000 / 60 / 60 / 24 / 365)}
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Gender</h5>
                                        {profile.gender}
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Weight</h5>
                                        {profile.weight} lbs.
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Height</h5>
                                        {profile.height} in.
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Activity Level</h5>
                                        {activityLevels[profile.activityLevel - 1]}
                                    </div>
                                    <hr className="w-100" />
                                    <div>
                                        <h5>Goal</h5>
                                        {weightGoals[profile.weightGoal - 1]}
                                    </div>
                                </div>
                                <Button id="profile-edit-btn" color="primary" className="mt-2" onClick={() => { setIsEditing(!isEditing) }}>Edit</Button>
                            </> : <Form onSubmit={submitChanges}>
                                <fieldset>
                                    <FormGroup>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            autoComplete="first-name"
                                            name="firstName"
                                            type="text"
                                            value={newProfile.firstName}
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
                                            value={newProfile.lastName}
                                            maxLength={25}
                                            onChange={changeState}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="gender">Gender</Label>
                                        <select className="form-control" name="gender" onChange={changeState} defaultValue={newProfile.gender}>
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
                                            value={newProfile.birthDate.includes("T") ? newProfile.birthDate.split("T")[0] : newProfile.birthDate}
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
                                            value={newProfile.weight}
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
                                            value={newProfile.height}
                                            onChange={(e) => { if (e.target.value.trim() !== "" && parseInt(e.target.value) >= 36) changeState(e) }}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="activityLevel">Activity Level</Label>
                                        <select className="form-control" name="activityLevel" onChange={changeState} defaultValue={newProfile.activityLevel}>
                                            <option value="" hidden>Select Level</option>
                                            <option value="1">Sedentary</option>
                                            <option value="2">Light/Average Exercise</option>
                                            <option value="3">Above Average Exercise</option>
                                            <option value="4">Extreme Exercise</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label htmlFor="weightGoal">Weight Goal</Label>
                                        <select className="form-control" name="weightGoal" onChange={changeState} defaultValue={newProfile.weightGoal}>
                                            <option value="" hidden>Select Goal</option>
                                            <option value="1">Lose 2 lbs./week</option>
                                            <option value="2">Lose 1 lb./week</option>
                                            <option value="3">Maintain Weight</option>
                                            <option value="4">Gain 1 lb./week</option>
                                            <option value="5">Gain 2 lbs./week</option>
                                        </select>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button className="w-45" type="button" onClick={() => { setIsEditing(!isEditing) }}>Cancel</Button>
                                        <Button className="w-45 mx-4 px-4" color="primary">Save</Button>
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