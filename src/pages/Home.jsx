import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TrackPackage from './trackPackage';
import Register from './Signup';
import Login from './Login';
import '../styles/Home.css';

const Home = () => {
  // CustomLink function to highlight active links
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

  // State for search bar input
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery); // You can customize the search functionality here
  };

  return (
    <div className="container">
      {/* Navigation bar */}
      <nav className="nav">
        <Link to="/home" className="homePage">United Mail Services</Link>
        <ul>
          <CustomLink to="/home">Home</CustomLink>
          <CustomLink to="/track-package">Track Package</CustomLink>
          <CustomLink to="/signup">Sign Up</CustomLink>
          <CustomLink to="/login">Login</CustomLink>
        </ul>
      </nav>

      {/* Main content area */}
      <Routes>
        <Route path="/home" element={
          <div className="home-content" style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 200px)', // Adjust this value based on your nav and footer height
            textAlign: 'center',
            padding: '50px'
          }}>
            {/* Centered main content */}
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1>Welcome to United Mail Services</h1>
              <p>Track your packages, register for an account, or log in to access more features.</p>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} style={{ margin: '20px 0', width: '100%', maxWidth: '500px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search our services..."
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  marginBottom: '20px'
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>Search</button>
            </form>

            {/* Services section */}
            <div style={{ 
              marginTop: 'auto',
              width: '100%',
              maxWidth: '600px',
              textAlign: 'center',
              padding: '20px'
            }}>
              <h2>Our Services</h2>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                margin: '20px 0'
              }}>
                <li>Track Packages</li>
                <li>Send and Receive Parcels</li>
                <li>Find Post Office Locations</li>
                <li>Shipping Rates Calculator</li>
              </ul>
              <p>
                <Link to="/signup" className="btn btn-primary">
                  Get Started with a New Account
                </Link>
              </p>
            </div>
          </div>
        } />
        
        {/* Other routes */}
        <Route path="/track-package" element={<TrackPackage />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 United Mail Services. All rights reserved.</p>
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service">Terms of Service</Link></li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;