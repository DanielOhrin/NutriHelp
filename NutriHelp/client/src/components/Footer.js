import { Link, useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation()

    return (
        location.pathname === "/daily" &&
        <footer>
            Powered by <Link to="https://www.nutritionix.com" target="_blank">Nutritionix</Link>
        </footer>
    )
}

export default Footer