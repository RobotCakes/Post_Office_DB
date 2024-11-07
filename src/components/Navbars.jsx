import { Link, useMatch, useResolvedPath, useNavigate } from 'react-router-dom';
import '../styles/nav.css'

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    );
}

function handleLogout(navigate) {
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
  navigate("/login");
}

export function GuestNavbar() {
    return(
        <nav className="nav">
            <Link to="/" className="homePage">Texas Mail Services</Link>
            <ul>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/track-package">Track Package</CustomLink>
                <CustomLink to="/signup">Sign Up</CustomLink>
                <CustomLink to="/login">Login</CustomLink>
            </ul>
        </nav>
    )
}

export function EmployeeNavbar(){
  const navigate = useNavigate();
  return (
    <nav className="nav">
      <Link to="/employee-home" className="homePage">Employee Dashboard</Link>
      <ul>
        <CustomLink to="/manage-packages">Manage Packages</CustomLink>
        <CustomLink to="/employee-supplies">Supplies</CustomLink>
        <CustomLink to="/incoming-packages">Incoming Packages</CustomLink>
        <CustomLink to="/employee-profile">Profile</CustomLink>
        <li>
          <button onClick={() => handleLogout(navigate)} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}

export function ManagerNavbar(){

}

export function CustomerNavbar(){
  const navigate = useNavigate();
  return(
    <nav className = "nav">
            <Link to="/customer-home" className="homePage">
                Home
            </Link>
            <ul>
                <CustomLink to="/package-history">Package History</CustomLink>
                <CustomLink to="/package-status">Package Status</CustomLink>
                {/* NOT REAL PAGE, JUST PLACEHOLDER*/}
                <CustomLink to="/customer-profile">Profile</CustomLink>
                <li>
                <button onClick={() => handleLogout(navigate)} className="logout-button">
                  Logout
                </button>
              </li>
            </ul>
        </nav>
  )
}

export function BusinessNavbar(){

}

export function AdminNavbar(){

}

export {CustomLink};