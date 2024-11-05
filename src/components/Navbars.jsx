import { Link, useMatch, useResolvedPath } from 'react-router-dom';
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

export {CustomLink};