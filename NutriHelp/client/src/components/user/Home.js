import { useState } from "react"
import { Button } from "reactstrap"
import randomQuote from "../../assets/js/quotes"
import logo from "../../assets/images/company_logo.png"
import "./home.css"

const Home = () => {
    const [userStats, setUserStats] = useState({
        firstName: "Daniel",
        waterRemaining: 40,
        caloriesRemaining: 1800,
        exerciseMinutes: 0
    })

    return (
        <section id="user-home-container">
            <img id="home-logo" src={logo} alt="Logo" />
            <div>
                <h2>Hello, {userStats.firstName}!</h2>
                <article id="home-user-stats">
                    <h3>Daily Rundown</h3>
                    <div>
                        <div>
                            <h5>Calories Remaining</h5>
                            <big>{userStats.caloriesRemaining}</big>
                        </div>
                        <div>
                            <h5>Water Remaining</h5>
                            <big>{userStats.waterRemaining} oz.</big>
                        </div>
                        <div>
                            <h5>Exercise Minutes</h5>
                            <big>{userStats.exerciseMinutes}</big>
                        </div>
                    </div>
                    <blockquote id="home-quote" cite="https://upperhand.com/50-motivational-workout-quotes/">{randomQuote()}</blockquote>
                    <Button>Yeah Im a button!</Button>
                </article>
            </div>
        </section>
    )
}

export default Home