import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../styles/home.css';

const Home = () => {
    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
      
        return (
          <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
              {children}
            </Link>
          </li>
        )
    }
    return (
        <nav className = "nav">
            <Link to="/" className="homePage">
                Home
            </Link>
            <ul>
                <CustomLink to="/package-history">Package History</CustomLink>
                <CustomLink to="/package-status">Package History</CustomLink>
                {/* NOT REAL PAGE, JUST PLACEHOLDER*/}
                <CustomLink to="/customer-profile">Profile</CustomLink>
                <CustomLink to="/logout">Login</CustomLink>
            </ul>
        </nav>
    )
}

export default Home;