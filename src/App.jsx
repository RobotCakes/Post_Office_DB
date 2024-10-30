import { useState } from 'react'

// testing desktop import { useAuth } from "./auth/SessionProvider"; make session provider for authentication? ~davis 
import reactLogo from './assets/react.svg'
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import TrackPackage from "./pages/trackPackage"
import './styles/App.css'
import { Routes, Route } from 'react-router-dom';


function App() {
  const [count, setCount] = useState(0)

  return (
    /*
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
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    
      
    </>
    */
      <div className="App">
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/track-package" element={<TrackPackage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

          </Routes>

      </div>
      
      
  )
}

export default App