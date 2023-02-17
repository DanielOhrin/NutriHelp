import { useEffect, useState } from "react"
import { Button } from "reactstrap"
import randomQuote from "../../assets/js/quotes"
import logo from "../../assets/images/company_logo.png"
import "./Home.css"
import { getCurrentProfile } from "../../modules/userProfileManager"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const [userProfile, setUserProfile] = useState({}),
        navigate = useNavigate()

    useEffect(() => {
        getCurrentProfile(true).then(setUserProfile)
    }, [])

    return (
        <section id="user-home-container">
            <img id="home-logo" src={logo} alt="Logo" />
            <div>
                <h2>Hello, {userProfile.firstName}!</h2>
                <article id="home-user-stats">
                    <h3>Daily Rundown</h3>
                    <div>
                        <div>
                            <h5>Calories Remaining</h5>
                            <big>{userProfile.dailyStats?.caloriesRemaining}</big>
                        </div>
                        <div>
                            <h5>Water Remaining</h5>
                            <big>{userProfile.dailyStats?.waterRemaining} oz.</big>
                        </div>
                        <div>
                            <h5>Exercise Minutes</h5>
                            <big>{userProfile.dailyStats?.exerciseMinutes}</big>
                        </div>
                    </div>
                    <blockquote id="home-quote" cite="https://upperhand.com/50-motivational-workout-quotes/">{randomQuote()}</blockquote>
                    <Button color="primary" id="user-home-btn" onClick={() => navigate("/daily")}>Detailed View</Button>
                </article>
            </div>
        </section>
    )
}

export default Home