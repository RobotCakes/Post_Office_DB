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

export function handleLogout(navigate) {
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


export function CustomerNavbar() {
  const navigate = useNavigate();
  return(
    
      <nav className="nav">
          <Link to="/customer-home" className="homePage">Texas Mail Services</Link>
          <ul>
              <CustomLink to="/customer-home">Home</CustomLink>
              <CustomLink to="/package-history">Package History</CustomLink>
              <CustomLink to="/package-status">Package Status</CustomLink>
              <CustomLink to="/supplies">Supplies Store</CustomLink>
              <CustomLink to="/customer-profile">Profile</CustomLink>
              
          </ul>
          <button onClick={() => handleLogout(navigate)} className="logout-button">
                Logout
          </button>
      </nav>
  )
}


export function EmployeeNavbar(){
  const navigate = useNavigate();
  return(
    <nav className="nav">
      <Link to="/employee-home" className="homePage">Employee Dashboard</Link>
      <ul>
        <CustomLink to="/employee-home">Home</CustomLink>
        <CustomLink to="/manage-packages">Manage Packages</CustomLink>
        <CustomLink to="/manage-supplies">Manage Supplies</CustomLink>
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
  const navigate = useNavigate();
  return(
    <nav className="nav">
      <Link to="/manager-home" className="homePage">Manager Dashboard</Link>
      <ul>
        <CustomLink to="/manager-home">Home</CustomLink>
        <CustomLink to="/manage-packages">Manage Packages</CustomLink>
        <CustomLink to="/manage-supplies">Manage Supplies</CustomLink>
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


export function BusinessNavbar(){
  const navigate = useNavigate();
  return(
    
      <nav className="nav">
          <Link to="/business-home" className="homePage">Texas Mail Services</Link>
          <ul>
              <CustomLink to="/business-home">Home</CustomLink>
              <CustomLink to="/business-history">Package History</CustomLink>
              <CustomLink to="/business-status">Package Status</CustomLink>
              <CustomLink to="/business-create-package">Create Package</CustomLink>
              <CustomLink to="/business-profile">Profile</CustomLink>
          </ul>
          <button onClick={() => handleLogout(navigate)} className="logout-button">
                Logout
          </button>
      </nav>
  )
}

export function AdminNavbar(){
  const navigate = useNavigate();
  return (
    <nav className = "nav">
            <Link to="/admin-home" className="homePage">Admin Dashboard</Link>
            <ul>
                <CustomLink to="/manage-all-packages">Manage Packages</CustomLink>
                <CustomLink to="/manage-all-supplies">Manage Supplies</CustomLink>
                <CustomLink to="/admin-reports">Reports</CustomLink>
            </ul>
            <button onClick={() => handleLogout(navigate)} className="logout-button">
                Logout
            </button>
        </nav>
    )
}


export {CustomLink};