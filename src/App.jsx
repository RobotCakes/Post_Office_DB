// src/App.jsx
import { useState } from "react";
import { useAuth } from "./auth/SessionProvider"; // Import useAuth hook
import reactLogo from "./assets/react.svg";
import "./styles/App.css";




function App() {
  const [count, setCount] = useState(0);
  const { user, login, logout } = useAuth(); // Access user, login, and logout from useAuth



  const handleLogin = () => {
    // Mock user data
    const userData = { name: "John dou", email: "john@example.com" };
    login(userData); // Call login to set the user data
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>

      <div className="auth-section">
        {user ? (
          <div>
            <p>Welcome, {user.name}!</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
