import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../../styles/home.css';

const managerHome = () => {
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
                <CustomLink to="/manage-packages">Manage Packages</CustomLink>
                <CustomLink to="/manage-employee">Manage Employees</CustomLink>
                <CustomLink to="/manage-truck">Manage Trucks</CustomLink>
                <CustomLink to="/employee-supplies">Supplies</CustomLink>
                {/* NOT REAL PAGE, JUST PLACEHOLDER*/}
                <CustomLink to="/incoming-packages">Incoming Packages</CustomLink>
                <CustomLink to="/manager-reports">Reports</CustomLink>
                <CustomLink to="/manager-profile">Profile</CustomLink>
                <CustomLink to="/logout">Login</CustomLink>
            </ul>
        </nav>
    )
}

export default managerHome;