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
                Admin Home
            </Link>
            <ul>
                {/* NOT REAL PAGE, JUST PLACEHOLDER*/}
                <CustomLink to="/admin-manage-packages">Manage Packages</CustomLink>
                <CustomLink to="/admin-supplies">Supplies</CustomLink>
                <CustomLink to="/admin-incoming-packages">Incoming Packages</CustomLink>
                <CustomLink to="/admin-reports">Reports</CustomLink>
                <CustomLink to="/admin-profile">Profile</CustomLink>
                <CustomLink to="/logout">Login</CustomLink>
            </ul>
        </nav>
    )
}