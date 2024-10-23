import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackPackage from './trackPackage';
import Register from './Signup'; 
import Login from './Login'; 
import '../styles/Home.css';

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
      <div className="container">

        <nav className = "nav">
            <Link to="/home" className="homePage">
                Site Name
            </Link>
            <ul>
                <CustomLink to="/track-package">Track Package</CustomLink>
                <CustomLink to="/signup">Sign Up</CustomLink>
                <CustomLink to="/login">Login</CustomLink>
            </ul>
        </nav>  


        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/track-package" element={<TrackPackage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>

      </div>
        
    )
}

export default Home;